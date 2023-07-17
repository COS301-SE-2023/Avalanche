import { Test, TestingModule } from '@nestjs/testing';
import { DomainNameAnalysisService } from './domain-name-analysis.service';
import { HttpService } from '@nestjs/axios';
import { SnowflakeService } from 'src/snowflake/snowflake.service';

describe('DomainNameAnalysisService', () => {
  let service: DomainNameAnalysisService;

  beforeEach(async () => {
    const mockHttpService = {}; // Mock out HttpService, since we don't need it for the test
    const mockSnowflakeService = {}; // Mock out SnowflakeService, since we don't need it for the test

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DomainNameAnalysisService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: SnowflakeService, useValue: mockSnowflakeService },
      ],
    }).compile();

    service = module.get<DomainNameAnalysisService>(DomainNameAnalysisService);
  });

  it('should correctly normalize data', () => {
    const data = JSON.stringify({
      data: [
        { word: 'test1', frequency: 5, domains: ['domain1', 'domain2'] },
        { word: 'test2', frequency: 15, domains: ['domain3', 'domain4'] },
        { word: 'test3', frequency: 25, domains: ['domain5', 'domain6'] },
        { word: 'test4', frequency: 35, domains: ['domain7', 'domain8'] },
        { word: 'test5', frequency: 45, domains: ['domain9', 'domain10'] },
      ],
    });

    const result = JSON.parse(service.normaliseData(data));

    expect(result[0].normalisedFrequency).toBeCloseTo(10);
    expect(result[1].normalisedFrequency).toBeCloseTo(21.6667, 4);
    expect(result[2].normalisedFrequency).toBeCloseTo(33.3333, 4);
    expect(result[3].normalisedFrequency).toBeCloseTo(45, 4);
    expect(result[4].normalisedFrequency).toBeCloseTo(56.6667, 4);
  });
});
