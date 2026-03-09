const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
  collectCoverageFrom: [
    'app/_domain/**/*.ts',
    'app/_application/**/*.ts',
    '!app/_domain/**/*.d.ts',
    '!app/_application/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 45,
      statements: 45,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
