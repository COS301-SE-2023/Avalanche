import { Injectable } from '@nestjs/common';
import * as ss from 'simple-statistics';

@Injectable()
export class AnalysisService {
  async analyze(jsonData: any[]): Promise<string> {
    if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
      throw new Error('Invalid data');
    }

    const keys = Object.keys(jsonData[0]['TRANSACTIONSBYREGISTRAR'][0]);
    if (keys.length < 2) {
      throw new Error('Data should have at least two columns');
    }

    const seriesData =
      keys.length === 3 ? this.groupBySeries(jsonData) : { total: jsonData };

    const statistics = { array: [] };

    for (const [series, data] of Object.entries(seriesData)) {
      const data = jsonData as Array<{ [key: string]: string | number }>;
      const independent = data.map((row) =>
        new Date(Object.values(row)[1] as string).getTime(),
      );

      const dependent = data.map((row) =>
        parseFloat(Object.values(row)[2] as string),
      );

      // Perform regression analysis
      const regressionLine = ss.linearRegression(
        independent.map((val, idx) => [val, dependent[idx]]),
      );
      const regressionFunction = ss.linearRegressionLine(regressionLine);

      // Calculate mean, min, max for dependent variable
      const mean = ss.mean(dependent);
      const min = ss.min(dependent);
      const max = ss.max(dependent);

      const result = data.map((row, i) => ({
        ...row,
        regression: regressionFunction(independent[i]),
      }));

      statistics[series] = {
        data: result,
        summary: { mean, min, max },
      };
    }

    console.log('stats:' + JSON.stringify(statistics));
    return JSON.stringify(statistics);
  }

  groupBySeries(jsonData: any[]): any {
    return jsonData.reduce((groupedData, row) => {
      const series = Object.values(row)[0] as string;
      (groupedData[series] = groupedData[series] || []).push(row);
      return groupedData;
    }, {});
  }
}
