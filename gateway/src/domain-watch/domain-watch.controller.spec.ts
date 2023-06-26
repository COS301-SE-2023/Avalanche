import { Test, TestingModule } from '@nestjs/testing';
import { DomainWatchController } from './domain-watch.controller';
import { DomainWatchService } from './domain-watch.service';

describe('DomainWatchController', () => {
  let controller: DomainWatchController;
  let service: jest.Mocked<DomainWatchService>;

  beforeEach(async () => {
    const mockService = {
      sendData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DomainWatchController],
      providers: [
        {
          provide: DomainWatchService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DomainWatchController>(DomainWatchController);
    service = module.get(DomainWatchService);
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
