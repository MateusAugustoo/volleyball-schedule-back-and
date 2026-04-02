import { env } from "@/env";
import { FastifyReply } from "fastify";

export function cleanCookie(reply: FastifyReply) {
  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  }

  reply.clearCookie('accessToken', cookieOptions)
  reply.clearCookie('refreshToken', cookieOptions)
}
