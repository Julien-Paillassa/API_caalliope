import { type ExceptionFilter, Catch, type ArgumentsHost, HttpException } from '@nestjs/common'
import { type Request, type Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch (exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    const error = typeof response === 'string'
      ? { message: response }
      : (exceptionResponse as object)

    response
      .status(status)
      .json({
        success: false,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...error
      })
  }
}
