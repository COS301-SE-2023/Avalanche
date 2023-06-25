/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import {DomainWatchService} from './domain-watch.service'
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe('domain watch service tests', () => {
    let domainWatchService: DomainWatchService;
    let httpService : HttpService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DomainWatchService,
                {provide: HttpService,
                    useValue: {
                        post: jest.fn
                    }
                }
            ]
        }).compile()
        domainWatchService = module.get<DomainWatchService>(DomainWatchService);
        httpService = module.get<HttpService>(HttpService)
    })

    it("Domain Watch should be defined", () => {
        expect(domainWatchService).toBeDefined();
    })
    
    it("Domain watch sends valid data", async () => {
        const data = { some: 'data' };
      const responseData = { message: 'Success' };

      jest.spyOn(httpService, 'post').mockReturnValueOnce(of({ data: responseData } as AxiosResponse));

      const result = await domainWatchService.sendData(data);

      expect(httpService.post).toHaveBeenCalledWith(
        'http://zanet.cloud:4004/domainWatch/list',
        data,
      );
      expect(result).toEqual(JSON.stringify(responseData));
    })
})