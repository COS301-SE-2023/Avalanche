import { Injectable } from '@nestjs/common';

@Injectable()
export class GraphFormatService {
  /*
      Format data in chartJS format:
      const data = {
        [independent labels],
        datasets: [
            {
                label: 'Series 1',
                data: []
            },
            {
                label: 'Dataset 2',
                data: [],
            }
        ],
      };
  */
  async formatTransactions(data: string): Promise<string> {
    const dataArr = JSON.parse(JSON.parse(data)[0]['TRANSACTIONSBYREGISTRAR']);
    if (dataArr.length > 0) {
      const arr0 = dataArr[0];
      const keys = Object.keys(dataArr[0]);
      if (keys.length === 3) {
        return this.formatThreeColumns(keys, data, 'TRANSACTIONSBYREGISTRAR');
      } else if (keys.length === 4) {
        return this.formatFourColumns(keys, data, 'TRANSACTIONSBYREGISTRAR');
      } else {
        throw new Error('Invalid size array structure.');
      }
    } else {
      throw new Error('Empty data array.');
    }
  }

  formatThreeColumns(keys: string[], data: string, name: string): string {
    const dataArr = JSON.parse(JSON.parse(data)[0][name]);
    const seriesKey = keys[1];
    const indepKey = keys[0];
    const depKey = keys[2];
    const labels = [];
    const datasets = {};

    dataArr.forEach((datum) => {
      if (!labels.includes(datum[indepKey])) {
        labels.push(datum[indepKey]);
      }
      if (!datasets[datum[seriesKey]]) {
        datasets[datum[seriesKey]] = {
          label: datum[seriesKey],
          data: [],
        };
      }
      datasets[datum[seriesKey]].data.push(datum[depKey]);
    });

    return JSON.stringify({
      labels,
      datasets: Object.values(datasets),
    });
  }

  formatFourColumns(keys: string[], data: string, name: string): string {
    const dataArr = JSON.parse(JSON.parse(data)[0][name]);
    const seriesKey = keys[1];
    const indepKey = keys[0];
    const seriesKey2 = keys[2];
    const depKey = keys[3];
    const labels = [];
    const datasets = {};

    dataArr.forEach((datum) => {
      if (!labels.includes(datum[indepKey])) {
        labels.push(datum[indepKey]);
      }
      if (!datasets[datum[seriesKey]]) {
        datasets[datum[seriesKey]] = {
          label: datum[seriesKey] + '-' + datum[seriesKey2],
          data: [],
        };
      }
      datasets[datum[seriesKey]].data.push(datum[depKey]);
    });

    return JSON.stringify({
      labels,
      datasets: Object.values(datasets),
    });
  }
}
