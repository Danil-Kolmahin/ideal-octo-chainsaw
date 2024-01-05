import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === 401) {
      response.setHeader(
        'WWW-Authenticate',
        'Basic realm="ideal-octo-chainsaw", charset="UTF-8"'
      );
    }
    response.status(status).json(exception.getResponse());
  }
}
