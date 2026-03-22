import { db } from "@/db/client";
import { nanoid } from "nanoid";
import { emailVerificationToken } from "@/db/schema/email_verification"

type InsertTokenVarifyEmail = {
  usersId: string,
  token: string,
  expiresAt: Date,
}


export async function insertTokenVarifyEmail({
  usersId,
  token,
  expiresAt
}: InsertTokenVarifyEmail) {
  const id = nanoid()

  await db.insert(emailVerificationToken).values({
    id,
    usersId,
    token,
    expiresAt,
  })
}