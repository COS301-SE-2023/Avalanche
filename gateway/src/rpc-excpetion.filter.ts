/* eslint-disable prettier/prettier */
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilterT implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    let status = 500; // Default status
    const error = exception.getError();

    // Check if the error is an object and has a 'status' property
    if (typeof error === 'object' && error !== null && 'status' in error) {
      status = error.status as number ;
    }

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
