import { Catch, ExceptionFilter, HttpException, ArgumentsHost } from '@nestjs/common';

@Catch(HttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    response
      .status(status)
      .json({
        statusCode: status,
        message: (errorResponse as any).message || 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      });
  }
}

