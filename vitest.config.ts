import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: 'node',
    env: {
      DATABASE_URL: 'postgres://test:test@localhost:5432/test',
      SMTP_HOST: 'localhost',
      SMTP_PORT: '1025',
      SMTP_USER: 'test',
      SMTP_PASS: 'test',
      COOKIE_SECRET: 'test-cookie-secret',
      JWT_SECRET: 'test-jwt-secret',
      NODE_ENV: 'test'
    }
  },
})
