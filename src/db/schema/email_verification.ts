import { users } from './user'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const emailVerificationToken = pgTable('email_verification_token', {
  id: text('id').primaryKey(),
  usersId: text('user_id').notNull().references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})