import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { SnowflakeService } from './snowflake/snowflake.service';

describe('AppModule Test Connection', () => {
  let snowflakeService: SnowflakeService;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    snowflakeService = testingModule.get<SnowflakeService>(SnowflakeService);
  });

  it('should connect to Snowflake service', async () => {
    const simpleQuery = 'SELECT CURRENT_DATE();';
    let result;

    try {
      result = await snowflakeService.execute(simpleQuery);
    } catch (error) {
      // handle error
    }

    expect(result).toBeDefined(); // Or any assertion related to your use case
  }, 15000);
});
