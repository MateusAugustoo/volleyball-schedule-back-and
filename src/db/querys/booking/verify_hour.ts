import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { bookings } from "@/db/schema";

type IVerifyHour = Pick<typeof bookings.$inferSelect, "bookingDate" | "courtId" | "startHour">;

export async function verifyHour({ bookingDate, courtId, startHour }: IVerifyHour) {
  const result = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.bookingDate, bookingDate),
        eq(bookings.courtId, courtId),
        eq(bookings.startHour, startHour)
      )
    );

  const isOccupied = result.length > 0;

  return {
    isOccupied,
    isAvailable: !isOccupied,
    booking: isOccupied ? result[0] : null
  };
}