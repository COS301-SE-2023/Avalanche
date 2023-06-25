import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { DomainWatchService } from './domain-watch.service';

describe('DomainWatchService', () => {
  let service: DomainWatchService;
  let httpMock: MockAdapter;

  beforeEach(() => {
    service = new DomainWatchService(new HttpService(axios));
    httpMock = new MockAdapter(axios);
  });

  afterEach(() => {
    httpMock.reset();
  });

  describe('sendData', () => {
    const data = { test: 'test' };
    const endpoint = 'http://zanet.cloud:4004/domainWatch/list';

    it('should return the response data', async () => {
      const mockResponse = 'Post response data';

      httpMock.onPost(endpoint, data).reply(200, mockResponse);

      const result = await service.sendData(data);

      expect(result).toEqual(JSON.stringify(mockResponse));
    });
  });
});
