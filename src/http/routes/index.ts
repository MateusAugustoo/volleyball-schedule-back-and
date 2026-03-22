import { type FastifyInstance } from "fastify";
import { registerUserRoute } from "./auth/register_route";
import { verifyEmailRoute } from "./auth/verify_email";
import { loginUserRoute } from "./auth/login_router";

export const routes = async (server: FastifyInstance) => {
  server.register(loginUserRoute)
  server.register(registerUserRoute)
  server.register(verifyEmailRoute)
}