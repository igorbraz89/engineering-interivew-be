import type { Request, Response, NextFunction } from 'express';
import Router from 'express-promise-router';
import passport from 'passport';
import * as dotenv from 'dotenv';

dotenv.config();

const authenticateIfAuthorized = (strategy: string) => (req, res, next) => {
    passport.authenticate(strategy, (err, user) => {
        if (err) {
            return next(err);
        }

        // TODO: In case of FE impl for this tech challenge redirect to error page.
        if (!user) {
            return res.redirect(303, '/');
        }

        return req.session.regenerate(() => {
            return req.login(user, (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }
                return res.json(user);
            });
        });
    })(req, res, next);
};

const ensureAuthenticated: NextFunction | any = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json();
    }
};

function handleSignUp(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('signup', (err, user) => {
        if (err) {
            // TODO: redirect to the error page when it will be implemented
            return next(err);
        }
        if (!user.authorized) {
            return res.status(202).json(user);
        }
        return req.session.regenerate(() => {
            return req.login(user, (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }
                return res.status(200).json(user);
            });
        });
    })(req, res, next);
}

function handleLogout(req: Request, res: Response) {
    req.session.destroy(() => req.logout());
    res.sendStatus(400).json();
}

const authRouter = Router();

authRouter.use((req: Request, _, next: NextFunction) => {
    const {
        query: { next: returnTo },
    } = req;
    if (returnTo) {
        req.session!.returnTo = decodeURIComponent(returnTo as string);
    }
    next();
});

authRouter.post(
    '/signup',
    handleSignUp
);

authRouter.post(
    '/login',
    authenticateIfAuthorized(process.env.NODE_ENV === 'test' ? 'test' : 'login')
);

authRouter.get('/logout', handleLogout);
authRouter.use((req: Request, _, next: NextFunction) => {
    const {
        query: { next: returnTo },
    } = req;
    if (returnTo) {
        req.session!.returnTo = decodeURIComponent(returnTo as string);
    }
    next();
});
export default authRouter;
export { ensureAuthenticated };
