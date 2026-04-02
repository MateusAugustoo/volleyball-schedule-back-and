import { server } from "@/server";
import supertest from "supertest";
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock(import('@/lib/auth/clean-cookie.js'), () => ({
  cleanCookie: vi.fn()
}))

describe('Auth Routes - Logout', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve deslogar o usuário com sucesso se ele possuir o cookie', async () => {
    await server.ready()

    const response = await supertest(server.server)
      .post('/api/auth/logout')
      .set('Cookie', ['refreshToken=valid_fake_token_123'])

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'Logout successful' })
  })

  it('deve retornar 401 Unauthorized se requisição de logout for enviada sem cookie ativo', async () => {
    await server.ready()

    const response = await supertest(server.server)
      .post('/api/auth/logout')

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: 'Unauthorized' })
  })

})