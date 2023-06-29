import { Test, TestingModule } from '@nestjs/testing';
import { DomainNameAnalysisController } from './domain-name-analysis.controller';
import { DomainNameAnalysisService } from './domain-name-analysis.service';

describe('DomainWatchController', () => {
  let controller: DomainNameAnalysisController;
  let service: jest.Mocked<DomainNameAnalysisService>;

  beforeEach(async () => {
    const mockService = {
      sendData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DomainNameAnalysisController],
      providers: [
        {
          provide: DomainNameAnalysisService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DomainNameAnalysisController>(
      DomainNameAnalysisController,
    );
    service = module.get(DomainNameAnalysisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('sendData', () => {
    const data = { test: 'test' };

    it('should call service.sendData with correct parameters', async () => {
      const serviceResponse = { message: 'Data sent successfully' };
      service.sendData.mockResolvedValue(serviceResponse);

      const result = await controller.sendData(data);

      expect(service.sendData).toHaveBeenCalledWith(data);
      expect(result).toEqual(serviceResponse);
    });
  });
});
