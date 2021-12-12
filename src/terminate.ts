function terminate(server, publisher, options = { coredump: false, timeout: 500 }) {
  // Exit function
  const exit = (code) => {
    const exitMethod = () => (options.coredump ? process.abort() : process.exit(code));
    if (publisher.connected) {
      publisher.quit(exitMethod);
    } else {
      exitMethod();
    }
  };

  return (code, reason) => (err) => {
    if (err && err instanceof Error) {
      // eslint-disable-next-line no-console
      console.log(reason, err.message, err.stack);
    }

    // graceful shutdown
    server.close(exit(code));
    setTimeout(exit, options.timeout).unref();
  };
}

export default terminate;
