import { db } from '@/db/client'
import { eq } from 'drizzle-orm'
import { users } from '@/db/schema/user'

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))

  return user ?? null
}
