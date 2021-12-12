"use strict";
exports.__esModule = true;
function terminate(server, publisher, options) {
    if (options === void 0) { options = { coredump: false, timeout: 500 }; }
    // Exit function
    var exit = function (code) {
        var exitMethod = function () { return (options.coredump ? process.abort() : process.exit(code)); };
        if (publisher.connected) {
            publisher.quit(exitMethod);
        }
        else {
            exitMethod();
        }
    };
    return function (code, reason) { return function (err) {
        if (err && err instanceof Error) {
            // eslint-disable-next-line no-console
            console.log(reason, err.message, err.stack);
        }
        // graceful shutdown
        server.close(exit(code));
        setTimeout(exit, options.timeout).unref();
    }; };
}
exports["default"] = terminate;
