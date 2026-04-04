import { server } from '@/server'
import supertest from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { randomUUID } from 'crypto'

vi.mock(import('@/db/querys/booking/verify_hour.js'), () => ({
  verifyHour: vi.fn().mockResolvedValue({ isOccupied: false })
}))

vi.mock(import('@/db/querys/booking/register_booking.js'), () => ({
  insertBooking: vi.fn().mockResolvedValue({
    id: 'booking_123',
    userId: 'user_123',
    courtId: 'court_123',
    bookingDate: '2026-04-05',
    startHour: '14:00:00',
    endHour: '15:00:00'
  })
}))

describe('Booking Routes - Register Booking', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve registrar um novo agendamento com sucesso', async () => {
    await server.ready()

    const token = server.jwt.sign({ sub: 'user_123' })
    const courtId = randomUUID()
    const userId = randomUUID()

    const response = await supertest(server.server)
      .post('/api/booking')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', `accessToken=${token}`)
      .send({
        date: '2026-04-05T00:00:00.000Z',
        time: '14:00',
        courtId,
        userId,
      })
    
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id', 'booking_123')
    expect(response.body).toHaveProperty('startHour', '14:00:00')
  })

  it('não deve permitir agendamento em horário ocupado', async () => {
    const { verifyHour } = await import('@/db/querys/booking/verify_hour.js')
    vi.mocked(verifyHour).mockResolvedValueOnce({ isOccupied: true } as any)

    await server.ready()
    const token = server.jwt.sign({ sub: 'user_123' })
    const courtId = randomUUID()
    const userId = randomUUID()

    const response = await supertest(server.server)
      .post('/api/booking')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', `accessToken=${token}`)
      .send({
        date: '2026-04-05T00:00:00.000Z',
        time: '14:00',
        courtId,
        userId,
      })
    
    expect(response.status).toBe(409)
    expect(response.body).toEqual({ message: 'Horário já está agendado.' })
  })

  it('deve rejeitar uma requisição sem payload adequado (ex: formato de tempo invalido)', async () => {
    await server.ready()
    const token = server.jwt.sign({ sub: 'user_123' })

    const response = await supertest(server.server)
      .post('/api/booking')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', `accessToken=${token}`)
      .send({
        date: '2026-04-05T00:00:00.000Z',
        time: '99:999', 
        courtId: 'a123e456-7890-1234-5678-123456789012',
        userId: 'f123e456-7890-1234-5678-123456789012',
      })
    
    expect(response.status).toBe(400)
  })
})