import { z } from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { cleanCookie } from "@/lib/auth/clean-cookie";

export const logoutUserRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/api/auth/logout',
    {
      schema: {
        tags: ['auth'],
        response: {
          200: z.object({ message: z.string() }),
          401: z.object({ error: z.string() }),
        }
      }
    },
    async (request, reply) => {
      const refreshToken = request.cookies.refreshToken

      if (!refreshToken) {
        return reply.code(401).send({ error: 'Unauthorized' })
      }

      cleanCookie(reply)

      return reply.code(200).send({ message: 'Logout successful' })
    })
}