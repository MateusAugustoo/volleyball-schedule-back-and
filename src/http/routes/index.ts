import { type FastifyInstance } from "fastify";
import { registerUserRoute } from "./auth/register_route";
import { verifyEmailRoute } from "./auth/verify_email";
import { loginUserRoute } from "./auth/login_route";
import { logoutUserRoute } from "./auth/logout_route";
import { registerBookingRoute } from "./booking/register_booking_route";

export const routes = async (server: FastifyInstance) => {
  // Auth
  server.register(loginUserRoute)
  server.register(registerUserRoute)
  server.register(verifyEmailRoute)
  server.register(logoutUserRoute)

  // Booking
  server.register(registerBookingRoute)
}