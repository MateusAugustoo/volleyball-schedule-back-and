import { z } from 'zod';
import { nanoid } from 'nanoid';
import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { verifyHour } from "@/db/querys/booking/verify_hour";
import { insertBooking } from "@/db/querys/booking/register_booking";

export const registerBookingRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/api/booking',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['booking'],
        body: z.object({
          date: z.coerce.date(),
          time: z.string().regex(/^\d{2}:\d{2}$/),
          courtId: z.uuid(),
          userId: z.uuid(),
        })
      }
    },
    async (request, reply) => {
      const { date, time, courtId, userId } = request.body;

      const bookingDate = date.toISOString().split('T')[0]!;
      const startHour = `${time}:00`;

      const { isOccupied } = await verifyHour({
        bookingDate,
        courtId,
        startHour,
      });

      if (isOccupied) {
        return reply.code(409).send({ message: 'Horário já está agendado.' });
      }

      const id = nanoid()
      const [hourStr, minStr] = time.split(':');
      const endHour = `${String(Number(hourStr!) + 1).padStart(2, '0')}:${minStr!}:00`;

      const booking = await insertBooking({
        id,
        userId,
        courtId,
        bookingDate,
        startHour,
        endHour,
      });

      return reply.code(201).send(booking);
    }
  );
};