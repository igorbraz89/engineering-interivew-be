import express from 'express';
import session from 'express-session';
import enforce from 'express-sslify';
import morgan from 'morgan';
import * as path from 'path';
import * as fs from 'fs';
import * as helmet from 'helmet';
import { getDb } from './db/db';
import setUpPassport from './passport-setup';
import authRouter from './routes/auth';
import tasksRouter, { taskRouter } from "./routes/tasks";

const db = getDb();
const app = express();

// Helmet security middleware -  It's easy to configure and provides a good set of validations to prevent common attacks
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      scriptSrc: ["'self'", "'unsafe-inline'"],
      upgradeInsecureRequests: process.env.DISABLE_HTTPS === 'false' ? [] : null,
    },
  })
);
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// Logging system
morgan.token('sessionid', (req) => {
  return req.sessionID;
});
morgan.token('user', (req) => {
  return req.session?.passport?.user;
});

app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :user :sessionid'
  )
);

// Session middleware
if (process.env.NODE_ENV === 'test') {
  app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
} else {
  app.use(
    session({
      name: 'challengesession',
      secret: 'a4df5a96fecf5bad2a5b451559b9aeb8',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 86400000,
        sameSite: 'strict',
      },
    })
  );
}

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize Passport and restore authentication state, if any, from the session
const passportMiddlewares = setUpPassport(db);
app.use(passportMiddlewares.passport);
app.use(passportMiddlewares.session);

// Wire db
app.use((req, res, next) => {
  req.db = db;
  next();
});
app.use('/api/auth', authRouter);
app.use('/api/task/:taskId', taskRouter);
app.use('/api/tasks', tasksRouter);


if (process.env.NODE_ENV === 'production') {
  app.use(
    morgan('common', {
      stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }),
    })
  );

  if (process.env.DISABLE_HTTPS === 'false') {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }
}

app.use((err, req, res, next) => {
  if (!res.headersSent && err.isJoi) {
    res.status(400).json({ message: err.message });
  } else {
    next(err);
  }
});

// Inserted some validations to better handle PG errors
app.use((err, req, res, next) => {
  // https://www.postgresql.org/docs/10/errcodes-appendix.html
  const postgresUniqueViolation = '23505';
  const postgresInputIssues = (code) =>
    ['22', '23', '44', 'P0'].some((errorClass) => code.startsWith(errorClass));
  if (!res.headerSent && err.code && postgresInputIssues(err.code)) {
    res.status(err.code === postgresUniqueViolation ? 409 : 400).json({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (!res.headersSent && err.isConflict) {
    res.status(409).json(err);
  } else {
    next(err);
  }
});

export default app;
