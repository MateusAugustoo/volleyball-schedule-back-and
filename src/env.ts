import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  CORS_ORIGIN_REQUEST: z.url().default('*'),
  DATABASE_URL: z.url(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  METHODS_REQUEST: z.array(z.string()).default(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']),
  COOKIE_SECRET: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production']).default('development')
})

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('Variaveis de ambiente invalidas', _env.error.issues)

  throw new Error('Variaveis de ambiente invalidas')
}

export const env = _env.data