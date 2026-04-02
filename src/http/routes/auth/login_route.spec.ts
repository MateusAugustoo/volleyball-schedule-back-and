import { server } from "@/server";
import supertest from "supertest";
import { describe, expect, vi, it, beforeEach } from 'vitest'

vi.mock(import('@/db/querys/auth/find_user_by_email.js'), () => ({
  findUserByEmail: vi.fn().mockResolvedValue({
    id: 'user_id_fake_123',
    name: 'John Doe Testing',
    email: 'john.doe@test.com',
    passHash: 'hash_fake_123',
    role: 'user',
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true,
  })
}))

vi.mock(import('@/utils/pass_hash.js'), () => ({
  verifyPassword: vi.fn().mockResolvedValue(true)
}))

vi.mock(import('@/lib/auth/set-cookie.js'), () => ({
  setCookie: vi.fn().mockResolvedValue(undefined)
}))

describe('Auth Routes - Login', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve fazer o login com sucesso e retornar 200 com informações do user', async () => {
    await server.ready()

    const response = await supertest(server.server)
      .post('/api/auth/login')
      .send({
        email: 'john.doe@test.com',
        password: 'Password123!'
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      user: {
        id: 'user_id_fake_123',
        name: 'John Doe Testing',
        email: 'john.doe@test.com',
        role: 'user',
      }
    })
  })

  it('deve retornar 401 caso o e-mail não seja encontrado no banco', async () => {
    const { findUserByEmail } = await import('@/db/querys/auth/find_user_by_email.js')
    vi.mocked(findUserByEmail).mockResolvedValueOnce(undefined as any)

    const response = await supertest(server.server)
      .post('/api/auth/login')
      .send({
        email: 'inexistente@test.com',
        password: 'Password123!'
      })

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: 'Email or password invalid' })
  })

  it('deve retornar 401 caso a senha esteja incorreta', async () => {
    const { verifyPassword } = await import('@/utils/pass_hash.js')
    vi.mocked(verifyPassword).mockResolvedValueOnce(false)

    const response = await supertest(server.server)
      .post('/api/auth/login')
      .send({
        email: 'john.doe@test.com',
        password: 'wrong_password!'
      })

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: 'Email or password invalid' })
  })

  it('deve retornar 400 caso o e-mail do usuário não esteja verificado', async () => {
    const { findUserByEmail } = await import('@/db/querys/auth/find_user_by_email.js')
    vi.mocked(findUserByEmail).mockResolvedValueOnce({
      id: 'user_id_fake_123',
      name: 'John Doe Testing',
      email: 'john.doe@test.com',
      passHash: 'hash_fake_123',
      role: 'user',
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
    })

    const response = await supertest(server.server)
      .post('/api/auth/login')
      .send({
        email: 'john.doe@test.com',
        password: 'Password123!'
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Email not verified' })
  })

})