import { server } from '@/server'
import supertest from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock(import('@/db/querys/auth/insert.js'), () => ({
  insertUser: vi.fn().mockResolvedValue('user_id_fake_123')
}))

vi.mock(import('@/db/querys/verify_email/verify_exit_user.js'), () => ({
  verifyExitUser: vi.fn().mockResolvedValue(null)
}))

vi.mock(import('@/db/querys/verify_email/insert_token_varify_email.js'), () => ({
  insertTokenVarifyEmail: vi.fn().mockResolvedValue(true)
}))

vi.mock(import('@/lib/mailer.js'), () => ({
  sendVerificationEmail: vi.fn()
}))


describe('Auth Routes - Register', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve registrar um novo usuário com sucesso', async () => {
    await server.ready()

    const response = await supertest(server.server)
      .post('/api/auth/register')
      .send({
        name: 'John Doe Testing',
        email: 'john.doe@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      })
    
    expect(response.status).toBe(201)
    expect(response.body).toEqual({ message: 'User created successfully' })
  })

  it('não deve permitir registro de e-mail que já existe', async () => {

    const { verifyExitUser } = await import('@/db/querys/verify_email/verify_exit_user.js')
    vi.mocked(verifyExitUser).mockResolvedValueOnce({ id: 'any_id_existente' } as any)

    await server.ready()

    const response = await supertest(server.server)
      .post('/api/auth/register')
      .send({
        name: 'John Duplicado',
        email: 'john.doe@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      })
    
    expect(response.status).toBe(409)
    expect(response.body).toEqual({ error: 'User already exists' })
  })
})