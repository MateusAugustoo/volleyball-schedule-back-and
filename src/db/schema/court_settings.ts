import { pgTable, text, time, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const courtSettings = pgTable('court_settings', {
  id: text('id').primaryKey(),
  name: text('name').notNull().default('Quadra Orla do Açude'),
  openingHour: time('opening_hour').notNull().default('17:00:00'),
  closingHour: time('closing_hour').notNull().default('23:00:00'),
  slotDuration: integer('slot_duration').notNull().default(60),
  maxBookingsPerUserPerDay: integer('max_bookings_per_user_per_day').notNull().default(1),
  advanceBookingDays: integer('advance_booking_days').notNull().default(7),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})