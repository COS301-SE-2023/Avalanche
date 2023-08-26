/* eslint-disable prettier/prettier */
import { Body, Controller, Req, Res, All, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ForwardService } from './forward.service';

@Controller('*')
export class AppController {
  constructor(private readonly forwardService: ForwardService) {}

  @All()
  async handleAll(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    try {
      const data = await this.forwardService.forwardRequest(req.method, req.url, body, req.headers);
      return res.json(data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      const errorCode = error.response?.data?.statusCode || 500;
      throw new HttpException({ message: errorMessage, status: errorCode }, errorCode);
    }
  }
}

