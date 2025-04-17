export default {
  verbose: true,
  testMatch: [
    '**/?(*.)+(test).[j]s?(x)',
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setupTests.js'],
  testTimeout: 30000
};
