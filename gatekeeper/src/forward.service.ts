/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosHeaders, Method } from 'axios';
import { map } from 'rxjs/operators';

@Injectable()
export class ForwardService {
  constructor(private httpService: HttpService) { }

  async forwardRequest(method: string, url: string, body?: any, headers?: any, params?: any) {
  if (headers && headers.authorization) {
    body.token = headers.authorization;
  }
    const response = await this.httpService.request({
      method: method as Method,
      url: `http://localhost:4000${url}`,
      data: body,
      params,
    }).pipe(map((axiosResponse) => axiosResponse.data)).toPromise();

    return response;
  }
}
