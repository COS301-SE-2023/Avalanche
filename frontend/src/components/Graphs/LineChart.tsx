import { IChart } from "@/interfaces";
import React, { useState } from "react";
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type JsonDataEntry = {
  [key: string]: string | number;
};

type ConvertedData = {
  series: {
    name: string;
    data: number[];
  }[];
  options: {
    xaxis: {
      categories: string[];
      title: {
        text: string;
      };
    };
    yaxis: {
      title: {
        text: string;
      };
      min: number;
    };
  };
};

const convertData = (jsonData: JsonDataEntry[]): ConvertedData => {
  const seriesMap: { [key: string]: { [key: string]: number } } = {};
  const xAxisSet = new Set<string>();
  const seriesSet = new Set<string>();
  let yMin = Infinity;
  let yMax = -Infinity;

  let xAxisLabel = "";
  let yAxisLabel = "";
  let seriesLabel = "";

  if (jsonData.length > 0) {
    const firstEntryKeys = Object.keys(jsonData[0]);
    xAxisLabel = firstEntryKeys[0];
    seriesLabel = firstEntryKeys[1];
    yAxisLabel = firstEntryKeys[2];
  }

  // Populate the seriesMap and collect unique xAxis and Series values
  jsonData.forEach((entry) => {
    const xAxis = entry[xAxisLabel] as string;
    const series = entry[seriesLabel] as string;
    const yAxis = entry[yAxisLabel] as number;

    xAxisSet.add(xAxis);
    seriesSet.add(series);

    if (!seriesMap[series]) {
      seriesMap[series] = {};
    }
    seriesMap[series][xAxis] = yAxis;

    yMin = Math.min(yMin, yAxis);
    yMax = Math.max(yMax, yAxis);
  });

  // Initialize the final object
  const convertedData: ConvertedData = {
    series: [],
    options: {
      xaxis: {
        categories: Array.from(xAxisSet),
        title: {
          text: xAxisLabel,
        },
      },
      yaxis: {
        title: {
          text: yAxisLabel,
        },
        min: Math.min(0, yMin)
      },

    }
  };

  // Populate the series data
  seriesSet.forEach((seriesName) => {
    const data: number[] = [];
    xAxisSet.forEach((xAxisValue) => {
      data.push(seriesMap[seriesName][xAxisValue] ?? 0);
    });
    convertedData.series.push({
      name: seriesName,
      data,
    });
  });

  return convertedData;
};

export function LineChart({ data, addClass }: IChart) {

  const options = convertData(data.jsonData).options

  const [chartData, setChartData] = useState(convertData(data.jsonData));

  return (
    <div className="line">
      <div className="row">
        <div className="mixed-chart">
          {(typeof window !== 'undefined') &&
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="line"
            />
          }
        </div>
      </div>
    </div>
  );
}
