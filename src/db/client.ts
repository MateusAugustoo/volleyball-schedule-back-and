import { env } from '@/env'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '@/db/schema/index'

const connectionString = env.DATABASE_URL
export const pg = postgres(connectionString, { prepare: false })
export const db = drizzle(pg, { schema })

export type Database = typeof db