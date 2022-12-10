module.exports = {
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!**/jest-*',
    '!**/jest.*',
    '!**/bin/**',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/.build/**',
    '!**/*.test.{js,ts}',
    '!**/*.mock.{js,ts}',
    '!**/types/*.{js,ts}',
    '!**/validations/**'
  ],
  moduleDirectories: ['node_modules'],
  testRegex: '.*\\.test.ts$',
  snapshotSerializers: [],
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['<rootDir>/setEnvVars.js'],
  transform: {
    '^.+\\.ts?$': [
      'esbuild-jest',
      {
        sourcemap: true
      }
    ]
  },
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 30,
      lines: 50,
      statements: 50
    }
  }
}
