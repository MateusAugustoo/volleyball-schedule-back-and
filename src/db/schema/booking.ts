import { sql } from "drizzle-orm";
import { users } from "./user";
import { pgTable, pgEnum, text, timestamp, date, time, unique, check } from "drizzle-orm/pg-core";
import { courtSettings } from "./court_settings";

export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled'])

export const bookings = pgTable('bookings',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    courtId: text('court_id').notNull().references(() => courtSettings.id, { onDelete: 'cascade' }),
    bookingDate: date('booking_date').notNull(),
    startHour: time('start_hour').notNull(),
    endHour: time('end_hour').notNull(),
    status: bookingStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    cancelledBy: text('cancelled_by').references(() => users.id),
    statusUpdatedBy: text('status_updated_by').references(() => users.id),
    statusUpdatedAt: timestamp('status_updated_at', { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    unique('unique_user_date')
      .on(table.userId, table.bookingDate, table.courtId),

    unique('unique_slot')
      .on(table.courtId, table.bookingDate, table.startHour),

    check(
      'valid_hour_order',
      sql`${table.endHour} > ${table.startHour}`
    ),

    check(
      'valid_hour_range',
      sql`${table.endHour} = ${table.startHour} + interval '1 hour'`
    ),
  ]
)