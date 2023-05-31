/* eslint-disable prettier/prettier */
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('domain-watch')
export class DomainWatchController {
  constructor(@Inject('DOMAIN_WATCH_SERVICE') private client: ClientProxy) {}
}