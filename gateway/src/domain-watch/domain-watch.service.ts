/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DomainWatchService {
  constructor(
    @Inject('DOMAIN_WATCH_SERVICE') private readonly client: ClientProxy,
  ) {}
}