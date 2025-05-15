module.exports = {
    testEnvironment: 'node',
    testTimeout: 30000,
    setupFilesAfterEnv: ['./jest.setup.js'],
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    verbose: true
};
