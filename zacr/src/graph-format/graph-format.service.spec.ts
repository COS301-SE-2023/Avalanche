import { Test, TestingModule } from '@nestjs/testing';
import { GraphFormatService } from './graph-format.service';

describe('GraphFormatService', () => {
  let service: GraphFormatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphFormatService],
    }).compile();

    service = module.get<GraphFormatService>(GraphFormatService);
  });
});
