import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { DomainNameAnalysisService } from './domain-name-analysis.service';

describe('DomainWatchService', () => {
  let service: DomainNameAnalysisService;
  let httpMock: MockAdapter;

  beforeEach(() => {
    service = new DomainNameAnalysisService(new HttpService(axios));
    httpMock = new MockAdapter(axios);
  });

  afterEach(() => {
    httpMock.reset();
  });

  describe('sendData', () => {
    const data = { test: 'test' };
    const endpoint = 'http://zanet.cloud:4005/domainNameAnalysis/list';

    it('should return the response data', async () => {
      const mockResponse = 'Post response data';

      httpMock.onPost(endpoint, data).reply(200, mockResponse);

      const result = await service.sendData(data);

      expect(result).toEqual(JSON.stringify(mockResponse));
    });
  });
});
