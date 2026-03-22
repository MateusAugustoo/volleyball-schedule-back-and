import type { FastifyError, FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

export function setupErrorHandler(server: FastifyInstance) {
  server.setErrorHandler((error: FastifyError, _request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.code(400).send({
        error: 'Dados inválidos',
        details: error.validation,
      })
    }

    if (error.statusCode && error.statusCode < 500) {
      return reply.code(error.statusCode).send({
        error: error.message,
      })
    }

    server.log.error(error)

    return reply.code(500).send({
      error: 'Internal server error',
    })
  })
}
