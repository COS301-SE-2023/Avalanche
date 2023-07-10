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
      const keys = Object.keys(dataArr[0]);
      if (keys.length === 3) {
        return this.formatThreeColumns(keys, data, 'TRANSACTIONSBYREGISTRAR');
      } else if (keys.length === 4) {
        return this.formatFourColumns(keys, data, 'TRANSACTIONSBYREGISTRAR');
      } else {
        throw new Error('Invalid size array structure in Transactions.');
      }
    } else {
      throw new Error('Empty data array.');
    }
  }

  async formatTransactionsRanking(data: string): Promise<string> {
    const dataArr = JSON.parse(JSON.parse(data)[0]['TRANSACTIONSBYREGISTRAR']);
    if (dataArr.length > 0) {
      const keys = Object.keys(dataArr[0]);
      if (keys.length === 4) {
        const seriesKey = keys[2];
        const indepKey = keys[0];
        const depKey = keys[3];
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
      } else {
        throw new Error('Invalid size array structure in Transactions.');
      }
    } else {
      throw new Error('Empty data array.');
    }
  }

  async formatMarketshare(data: string): Promise<string> {
    const dataArr = JSON.parse(JSON.parse(data)[0]['MARKETSHARE']);
    if (dataArr.length > 0) {
      const keys = Object.keys(dataArr[0]);
      if (keys.length === 2) {
        return this.formatTwoColumns(
          keys,
          data,
          'MARKETSHARE',
          'Marketshare data',
        );
      } else {
        throw new Error('Invalid size array structure in Market Share.');
      }
    } else {
      throw new Error('Empty data array.');
    }
  }

  async formatAgeAnalysis(data: string): Promise<string> {
    const dataArr = JSON.parse(JSON.parse(data)[0]['AGEANALYSIS']);
    if (dataArr.length > 0) {
      const keys = Object.keys(dataArr[0]);
      if (keys.length === 2) {
        return this.formatTwoColumns(keys, data, 'AGEANALYSIS', 'Age data');
      } else if (keys.length === 3) {
        return this.formatThreeColumns(keys, data, 'AGEANALYSIS');
      } else {
        throw new Error('Invalid size array structure in Age Analysis.');
      }
    } else {
      throw new Error('Empty data array.');
    }
  }

  async formatDomainNameAnalysis(data: string): Promise<string> {
    const dataArr = JSON.parse(data)['data'];
    if (dataArr.length > 0) {
      const keys = Object.keys(dataArr[0]);
      if (keys.length === 3) {
        const dataToSend = JSON.stringify([{ data: JSON.stringify(dataArr) }]);
        return this.formatTwoColumns(keys, dataToSend, 'data', 'Count');
      } else {
        throw new Error(
          'Invalid size array structure in Domain Name Analysis.',
        );
      }
    } else {
      throw new Error('Empty data array.');
    }
  }

  async formatDomainLengthAnalysis(data: string): Promise<string> {
    const dataArr = JSON.parse(data)['DOMAINLENGTHANALYSIS'];
    if (dataArr.length > 0) {
      const keys = Object.keys(dataArr[0]);
      if (keys.length === 2) {
        return this.formatTwoColumns(
          keys,
          data,
          'DOMAINLENGTHANALYSIS',
          'Count',
        );
      } else {
        throw new Error(
          'Invalid size array structure in Domain Length Analysis.',
        );
      }
    } else {
      throw new Error('Empty data array.');
    }
  }

  async formatNettVertical(data: string): Promise<string> {
    const dataArr = JSON.parse(data)['NETTVERTICALMOVEMENT'];
    if (dataArr.length > 0) {
      const keys = Object.keys(dataArr[0]);
      if (keys.length === 2) {
        return this.formatTwoColumns(
          keys,
          data,
          'NETTVERTICALMOVEMENT',
          'Count',
        );
      } else {
        throw new Error(
          'Invalid size array structure in Nett Vertical Movement.',
        );
      }
    } else {
      throw new Error('Empty data array.');
    }
  }

  formatTwoColumns(
    keys: string[],
    data: string,
    name: string,
    label: string,
  ): string {
    const dataArr = JSON.parse(JSON.parse(data)[0][name]);
    const indepKey = keys[0];
    const depKey = keys[1];
    const labels = [];
    const datasets = {};

    dataArr.forEach((datum) => {
      if (!labels.includes(datum[indepKey])) {
        labels.push(datum[indepKey]);
      }
      if (!datasets[label]) {
        datasets[label] = {
          label: label,
          data: [],
        };
      }
      datasets[label].data.push(datum[depKey]);
    });

    return JSON.stringify({
      labels,
      datasets: Object.values(datasets),
    });
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
