import { db } from "@/db/client";
import { users } from "@/db/schema/user";

type InsertUser = typeof users.$inferInsert

export async function insertUser({ id, name, email, passHash }: InsertUser) {
 try {
   const [result] = await db.insert(users).values({
     id,
     name,
     email,
     passHash,
   }).returning({ id: users.id })

   return result?.id ?? null
 } catch (error) {
  console.error(error)
  return null
 }
}