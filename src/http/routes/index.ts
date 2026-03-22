import { type FastifyInstance } from "fastify";
import { registerUserRoute } from "./auth/register_route";
import { verifyEmailRoute } from "./auth/verify_email";

export const routes = async (server: FastifyInstance) => {
  server.register(registerUserRoute)
  server.register(verifyEmailRoute)
}