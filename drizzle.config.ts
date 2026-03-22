import { env } from './src/env'
import { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema/*',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL
  }
} satisfies Config