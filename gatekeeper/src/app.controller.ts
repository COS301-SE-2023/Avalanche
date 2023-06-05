/* eslint-disable prettier/prettier */
import { Body, Controller, Req, Res, All } from '@nestjs/common';
import { Request, Response } from 'express';
import { ForwardService } from './forward.service';

@Controller('*')
export class AppController {
  constructor(private readonly forwardService: ForwardService) {}

  @All()
  async handleAll(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    try {
      const data = await this.forwardService.forwardRequest(req.method, req.url, body);
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ message: 'An error occurred.' });
    }
  }
}

