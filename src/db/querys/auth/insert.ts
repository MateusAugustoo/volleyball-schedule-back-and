import { db } from "@/db/client";
import { users } from "@/db/schema/user";

type InsertUser = {
  id: string
  name: string
  email: string
  pass: string
}

export async function insertUser({ id, name, email, pass }: InsertUser) {
 try {
   const [result] = await db.insert(users).values({
     id,
     name,
     email,
     passHash: pass,
   }).returning({ id: users.id })

   return result?.id ?? null
 } catch (error) {
  console.error(error)
  return null
 }
}