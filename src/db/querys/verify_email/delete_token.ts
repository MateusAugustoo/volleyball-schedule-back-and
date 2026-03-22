import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { emailVerificationToken } from "@/db/schema/email_verification";

export async function deleteTokenVerifyEmail(tokenId: string) {
  await db.delete(emailVerificationToken).where(eq(emailVerificationToken.id, tokenId))
}