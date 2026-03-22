import { env } from '@/env'
import fastify from "fastify";
import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod'
import { routes } from './http/routes';
import { setupErrorHandler } from './http/error-handler';

const server = fastify({logger: true}).withTypeProvider<ZodTypeProvider>();

server.register(fastifyCors, {
  origin: env.CORS_ORIGIN_REQUEST
})

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

setupErrorHandler(server)

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Volleyball Schedule API',
      description: 'API para gerenciamento de jogos de voleibol',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticação'
        }
      }
    },
  },
  transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server.register(routes)

const start = async () => {
  try {
    await server.listen({port:env.PORT});
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();