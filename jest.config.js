module.exports = {
  clearMocks: true,
  collectCoverage: true,
  moduleFileExtensions: ['ts'],
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/?(*.)(spec|test).{js,ts}'],
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/src/db/'],
  name: 'task-manager',
  displayName: 'task-manager',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.js'],
};
