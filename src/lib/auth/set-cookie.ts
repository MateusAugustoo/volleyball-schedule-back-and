import { env } from "@/env";
import { type CookieSerializeOptions } from "@fastify/cookie";
import { FastifyReply } from "fastify";

type SetCookieProps = {
  accessToken: string;
  refreshToken?: string;
}

export function setCookie(reply: FastifyReply, { accessToken, refreshToken }: SetCookieProps){
  const baseOptions: CookieSerializeOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  }

  reply.setCookie('accessToken', accessToken, {
    ...baseOptions,
    maxAge: 60 * 15,
  })

  if (refreshToken) {
    reply.setCookie('refreshToken', refreshToken, {
      ...baseOptions,
      maxAge: 60 * 60 * 24 * 7,
    })
  }
}