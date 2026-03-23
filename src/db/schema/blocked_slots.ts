import { pgTable, text, integer, timestamp, date, uuid } from "drizzle-orm/pg-core";
import { users } from "./user";

export const blockedSlots = pgTable("blocked_slots", {
  id: uuid("id").defaultRandom().primaryKey(),
  blockDate: date("block_date").notNull(),
  startHour: integer("start_hour").notNull(),
  endHour: integer("end_hour").notNull(),
  reason: text("reason"),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});