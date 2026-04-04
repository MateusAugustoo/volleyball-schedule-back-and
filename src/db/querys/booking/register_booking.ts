import { db } from "@/db/client";
import { bookings } from "@/db/schema";

type InsertBooking = typeof bookings.$inferInsert;

export async function insertBooking(data: InsertBooking) {
  const result = await db.insert(bookings).values(data).returning();
  return result[0];
}
