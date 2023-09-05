import { IChart } from "@/interfaces";
import React, { useState } from "react";
import dynamic from 'next/dynamic'
import { json } from "stream/consumers";
import { chartColours } from "./data";

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

export function LineChart({ data, height }: IChart) {



  const makeOptions = (jsonData: JsonDataEntry[]) => {
    let allOptions = convertData(jsonData);
    Object.assign(allOptions.options, {

      dataLabels: {
        enabled: false,
        colors: undefined,  // This will use the series color for each data label
       
      },
      colors:chartColours,
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        dashArray: 0, 
    },
      chart: {
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: false,
          zoomedArea: {
            fill: {
              color: '#90CAF9',
              opacity: 0.4
            },
            stroke: {
              color: '#0D47A1',
              opacity: 0.4,
              width: 1
            }
          }
        },
        id: "basic-line",
        height: 100, // or any other fixed height
    width: '100%',
    type: 'area',
        toolbar: {
          show: true,
          tools: {
            download: false,       // Display the download icon
            selection: true,      // Display the selection icon
            zoom: true,           // Display the zoom in and zoom out icons
            zoomin: false,        // Display only the zoom in icon
            zoomout: false,       // Display only the zoom out icon
            pan: false,            // Display the panning icon
            reset: true           // Display the reset icon
          }
        }
      },
      tooltip: {
        theme: 'dark', // or 'light'
        style: {
          backgroundColor: 'red', // Background color for the tooltip
          color: 'white',          // Text color for the tooltip
          fontSize: '12px',        // Font size for the tooltip
          fontFamily: 'Arial'     // Font family for the tooltip
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 900,
        animateGradually: {
            enabled: true,
            delay: 300
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        }
    }

    });
    return allOptions;
  }

  const [chartData, setChartData] = useState(makeOptions(data.jsonData));

  return (
    <div className="line">
      <div className="row max-h-screen">
        <div className="mixed-chart max-h-screen">
          {(typeof window !== 'undefined') &&
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="line"
              height={height}
            />
          }
        </div>
      </div>
    </div>
  );
}
