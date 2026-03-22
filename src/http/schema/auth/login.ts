import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type LoginUserSchema = z.infer<typeof loginUserSchema>

export const loginUserResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    role: z.string(),
  }),
})

export type LoginUserResponseSchema = z.infer<typeof loginUserResponseSchema>
