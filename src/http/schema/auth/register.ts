import { z } from 'zod'

export const registerUserSchema = z.object({
  name: z.string().min(3, 'O nome deve conter pelo menos 3 caracteres'),
  email: z.email('Email inválido'),
  password: z.string().min(6, 'A senha deve conter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve conter pelo menos 6 caracteres'),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})