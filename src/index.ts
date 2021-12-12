import * as dotenv from 'dotenv';
import app from './app';
import terminate from './terminate';

dotenv.config();
const port = process.env.PORT || 3001;
const server = app.listen(port);

// eslint-disable-next-line no-console
console.log(`Server is listening on ${port}`);
const exitHandler = terminate(server, {
    coredump: false,
    timeout: 500,
});

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));
process.on('SIGUSR2', exitHandler(0, 'SIGUSR2'));

export default server;
