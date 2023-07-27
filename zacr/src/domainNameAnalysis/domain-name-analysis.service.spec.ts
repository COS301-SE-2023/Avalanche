import { Test, TestingModule } from '@nestjs/testing';
import { DomainNameAnalysisService } from './domain-name-analysis.service';
import { HttpService } from '@nestjs/axios';
import { SnowflakeService } from '../snowflake/snowflake.service';

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

});
