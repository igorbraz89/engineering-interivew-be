module.exports = {
  clearMocks: true,
  collectCoverage: true,
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  moduleDirectories: ['coverage', 'node_modules', 'src'],
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/?(*.)(spec|test).{js,ts}'],
  testPathIgnorePatterns: ['/coverage/', '/node_modules/', '/build/'],
  verbose: true,
  displayName: 'task-manager',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.js'],
};
