import { Injectable } from '@nestjs/common';
import csvtojson from 'csvtojson';

@Injectable()
export class DataFormatService {
  async parse(data: string): Promise<any[]> {
    try {
      // First, try to parse the input data as JSON
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch {
      // If an error is thrown, then the data is not in valid JSON format
      // So, we assume it's CSV and parse it
      return csvtojson().fromString(data);
    }
  }
}
