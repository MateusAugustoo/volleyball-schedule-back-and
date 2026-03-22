import { z } from "zod";
import { findTokenVerifyUser } from "@/db/querys/verify_email/find_token_verify_user";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { updateVerifiedEmailUser } from "@/db/querys/auth/update_user_verify_email";
import { deleteTokenVerifyEmail } from "@/db/querys/verify_email/delete_token";

export const verifyEmailRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/api/auth/verify-email',
    {
      schema: {
        tags: ['auth'],
        querystring: z.object({
          token: z.string()
        }),
        response: {
          200: z.object({
            message: z.string()
          }),
          400: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { token } = request.query

      const tokenRecord = await findTokenVerifyUser(token)

      if (tokenRecord.length === 0) {
        return reply.code(400).send({ message: 'Token not found' })
      }

      const { usersId, expiresAt, id } = tokenRecord[0]!

      if (new Date(expiresAt) < new Date()) {
        return reply.code(400).send({ message: 'Token expired' })
      }

      await updateVerifiedEmailUser({ userId: usersId })
      await deleteTokenVerifyEmail(id)
      return reply.code(200).send({ message: 'Email verified successfully' })
    }
  )
}