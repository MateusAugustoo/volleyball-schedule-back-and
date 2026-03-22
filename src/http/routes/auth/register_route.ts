import { z } from "zod";
import { nanoid } from "nanoid";
import { registerUserSchema } from "@/http/schema/auth/register";
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { hashPassword } from '@/utils/pass_hash';
import { verifyExitUser } from "@/db/querys/verify_email/verify_exit_user";
import { insertUser } from "@/db/querys/auth/insert";
import { insertTokenVarifyEmail } from "@/db/querys/verify_email/insert_token_varify_email";
import { sendVerificationEmail } from "@/lib/mailer";


export const registerUserRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/api/register',
    {
      schema: {
        tags: ['auth'],
        body: registerUserSchema,
        response: {
          201: z.object({
            message: z.string()
          }),
          400: z.object({
            error: z.string()
          }),
          409: z.object({
            error: z.string()
          }),
          500: z.object({
            error: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const id = nanoid()
      const { name, email, password, confirmPassword } = request.body
      const { hash } = await hashPassword(password)

      const userExists = await verifyExitUser(email)

      if (userExists) {
        return reply.code(409).send({ error: 'User already exists' })
      }

      if (password !== confirmPassword) {
        return reply.code(400).send({ error: 'Passwords do not match' })
      }

      try {
        const userId = await insertUser({ id, name, email, pass: hash })

        if (!userId) {
          return reply.code(500).send({ error: 'Internal server error' })
        }

        const token = crypto.randomUUID()
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24)

        await insertTokenVarifyEmail({ usersId: userId, token, expiresAt })
        await sendVerificationEmail({ to: email, token })

        return reply.code(201).send({ message: 'User created successfully' })
      } catch (error) {
        console.error('Register error:', error)
        return reply.code(500).send({ error: 'Internal server error' })
      }
    }
  )
}