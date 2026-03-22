import { db } from "@/db/client";
import { emailVerificationToken } from "@/db/schema/email_verification";
import { eq } from "drizzle-orm";

export async function findTokenVerifyUser(token: string) {
  const record = await db
    .select()
    .from(emailVerificationToken)
    .where(eq(emailVerificationToken.token, token))

  return record
}