/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosHeaders, Method } from 'axios';
import { map } from 'rxjs/operators';
import { response } from 'express';

@Injectable()
export class ForwardService {
  constructor(private httpService: HttpService) { }

  async forwardRequest(method: string, url: string, body?: any, headers?: any, params?: any) {
    if (headers && headers.authorization) {
      body.token = headers.authorization;
    }
    try {
      const response = await this.httpService.request({
        method: method as Method,
        url: `${process.env.GATEWAY ? `http://gateway:4000` : "http://localhost:4000"}${url}`,
        data: body,
        params,
      }).pipe(map((axiosResponse: any) => axiosResponse.data)).toPromise();

      return response;
    } catch (error) {
      console.log(error,"Error in gk")
      console.log('Error data:', error.message);
      throw error; // Throw the entire error object
    }
  }
}
