import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'
import { SentryFilter } from './sentry.filter'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './utils/filters/http-exception.filter'
import * as express from 'express'
import { join } from 'path'
import * as cookieParser from 'cookie-parser'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    }
  })

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  app.useGlobalFilters(new HttpExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('Calliope API')
    .setDescription('API for Calliope')
    .setVersion('1.4')
    .addTag('calliope')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('', app, document)

  app.use('/uploads/avatars', express.static(join(__dirname, '..', 'uploads/avatars')))
  app.use('/uploads/covers', express.static(join(__dirname, '..', 'uploads/covers')))
  app.use(cookieParser())

  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    integrations: [
      new ProfilingIntegration()
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0
  })

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new SentryFilter(httpAdapter))

  await app.listen(3001)
}

void bootstrap()
