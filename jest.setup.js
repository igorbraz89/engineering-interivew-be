jest.setTimeout(30000);
global.console = {
  log: jest.fn(),
  debug: console.debug,
  trace: console.trace,
  error: console.error,
};
