import { server } from "@/server";
import supertest from "supertest";
import { describe, expect, vi, it, beforeEach } from 'vitest';

vi.mock(import('@/db/querys/verify_email/find_token_verify_user.js'), () => ({
  findTokenVerifyUser: vi.fn().mockResolvedValue([{
    id: 'token_id_123',
    usersId: 'user_123',
    token: 'valid_token_xyz',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    createdAt: new Date(),
  }])
}))
vi.mock(import('@/db/querys/auth/update_user_verify_email.js'), () => ({
  updateVerifiedEmailUser: vi.fn().mockResolvedValue(true)
}))

vi.mock(import('@/db/querys/verify_email/delete_token.js'), () => ({
  deleteTokenVerifyEmail: vi.fn().mockResolvedValue(true)
}))


describe('Auth Routes - Verify Email', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve verificar o e-mail com sucesso', async () => {
    await server.ready()

    const response = await supertest(server.server)
      .get('/api/auth/verify-email')
      .query({ token: 'valid_token_xyz' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'Email verified successfully' })
  })

  it('deve retornar 400 se o token não existir no banco de dados', async () => {
    const { findTokenVerifyUser } = await import('@/db/querys/verify_email/find_token_verify_user.js')
    vi.mocked(findTokenVerifyUser).mockResolvedValueOnce([])

    await server.ready()

    const response = await supertest(server.server)
      .get('/api/auth/verify-email')
      .query({ token: 'invalid_token' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ message: 'Token not found' })
  })

  it('deve retornar 400 se o token existir mas já estiver expirado', async () => {
    const { findTokenVerifyUser } = await import('@/db/querys/verify_email/find_token_verify_user.js')
    
    vi.mocked(findTokenVerifyUser).mockResolvedValueOnce([{
      id: 'token_id_123',
      usersId: 'user_123',
      token: 'expired_tokenXZY',
      expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      createdAt: new Date(),
    }])

    await server.ready()

    const response = await supertest(server.server)
      .get('/api/auth/verify-email')
      .query({ token: 'expired_tokenXZY' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ message: 'Token expired' })
  })
})