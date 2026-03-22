import { z } from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { loginUserSchema, loginUserResponseSchema } from "@/http/schema/auth/login";
import { findUserByEmail } from "@/db/querys/auth/find_user_by_email";
import { verifyPassword } from "@/utils/pass_hash";
import { setCookie } from "@/lib/auth/set-cookie";

export const loginUserRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/api/auth/login',
    {
      schema: {
        tags: ['auth'],
        body: loginUserSchema,
        response: {
          200: loginUserResponseSchema,
          400: z.object({ error: z.string() }),
          401: z.object({ error: z.string() }),
        }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body

      const user = await findUserByEmail(email)

      if (!user) {
        return reply.code(401).send({ error: 'Email or password invalid' })
      }

      const isPasswordValid = await verifyPassword(user.passHash, password)

      if (!isPasswordValid) {
        return reply.code(401).send({ error: 'Email or password invalid' })
      }

      if (!user.isEmailVerified) {
        return reply.code(400).send({ error: 'Email not verified' })
      }

      const accessToken = server.jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        { expiresIn: '15m' }
      )

      const refreshToken = server.jwt.sign(
        { id: user.id },
        { expiresIn: '7d' }
      )

      setCookie(reply, { accessToken, refreshToken })

      return reply.code(200).send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role ?? 'user',
        }
      })
    }
  )
}