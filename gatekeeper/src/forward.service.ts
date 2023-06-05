/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Method } from 'axios';
import { map } from 'rxjs/operators';

@Injectable()
export class ForwardService {
  constructor(private httpService: HttpService) {}

  async forwardRequest(method: string, url: string, body?: any, headers?: any, params?: any) {
    const response = await this.httpService.request({
      method: method as Method,
      url: `http://localhost:3000${url}`, // Replace with your Gateway's URL
      data: body,
      headers,
      params,
    }).pipe(map((axiosResponse) => axiosResponse.data)).toPromise();

    return response;
  }
}
