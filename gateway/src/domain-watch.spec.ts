/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import {DomainWatchService} from './domain-watch/domain-watch.service'
import { HttpService } from '@nestjs/axios';

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
    
})