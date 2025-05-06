// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'], // hoặc *.spec.ts nếu bạn thích
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true
}

export default config
