import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

type UpdateVerifiedEmailUser = {
  userId: string;
}

export async function updateVerifiedEmailUser({ userId }: UpdateVerifiedEmailUser) {
  await db
    .update(users)
    .set({ isEmailVerified: true })
    .where(eq(users.id, userId))
}