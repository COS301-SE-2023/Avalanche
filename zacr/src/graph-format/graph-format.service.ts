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
  async format(data: string): Promise<string> {
    const dataArr = JSON.parse(data)['data'];
    if (dataArr.length > 0) {
      const keys = Object.keys(dataArr[0]);
      if (keys.length === 3) {
        const seriesKey = keys[0];
        const indepKey = keys[1];
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
      } else if (keys.length === 2) {
        const dataArr = JSON.parse(data).data;
        const outputData: any = { labels: [], datasets: [] };

        if (dataArr.length > 0) {
          const keys = Object.keys(dataArr[0]);

          if (keys.length === 3) {
            // the existing code for the case of 3 keys...
          } else if (keys.length === 2) {
            const indepKey = keys[0];
            const depKey = keys[1];
            const depData = [];

            for (let i = 0; i < dataArr.length; i++) {
              outputData.labels.push(dataArr[i][indepKey]);
              depData.push(dataArr[i][depKey]);
            }

            outputData.datasets.push({ label: 'Data', data: depData });
          }
        }

        return JSON.stringify(outputData);
      } else {
        throw new Error('Invalid data structure.');
      }
    } else {
      throw new Error('Empty data array.');
    }
  }
}
