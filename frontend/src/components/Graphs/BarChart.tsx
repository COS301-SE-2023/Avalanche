import { IChart } from "@/interfaces";
import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic'
import { json } from "stream/consumers";
import { chartColours } from "./data";
import { convertData } from "./util";
import { useTheme } from "next-themes";

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
      //min: number;
    };
  };
};


export function BarChart({ data, height }: IChart) {
  const { theme } = useTheme();

  const getColor = ({ value, seriesIndex, w }: any): string => {
    if (value >= 0) {
      return '#008000';
    } else {
      return '#FF0000';
    }
  };

  const makeOptions = (jsonData: JsonDataEntry[]) => {

    let allOptions = convertData(jsonData, "bar", theme);
    let colourToUse = chartColours;
    let annotationToUse = {};
    if (allOptions.options.yaxis.title.text == " Movement") {
      colourToUse = [
        ({ value }: any): string => {
          if (value >= 0) {
            return '#008000' as string;
          } else {
            return '#FF0000' as string;
          }
        }
      ] as any[];
      annotationToUse = {
        yaxis: [{
          y: 0,
          y2: null,
          strokeDashArray: 1,
          borderColor: '#000000',
          fillColor: '#000000',
          opacity: 1,
          offsetX: 0,
          offsetY: 0,
          width: '100%',
          yAxisIndex: 0,
          label: {
            borderColor: '#c2c2c2',
            borderWidth: 0,
            borderRadius: 0,
            text: undefined,
            textAnchor: 'end',
            position: 'left',
            offsetX: -8,
            offsetY: 5,
            mouseEnter: undefined,
            mouseLeave: undefined,
            click: undefined,
            style: {
              background: '#00000000',
              color: '#000000',
              fontSize: '12px',
              fontWeight: 400,
              fontFamily: undefined,
              cssClass: 'apexcharts-yaxis-annotation-label',
              padding: {
                left: 5,
                right: 5,
                top: 0,
                bottom: 2,
              }
            },
          },
        }],
      };

    }
    Object.assign(allOptions.options, {

      dataLabels: {
        enabled: false,
        colors: undefined,  // This will use the series color for each data label

      },
      annotations: annotationToUse,
      colors: colourToUse,
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

  useEffect(() => {

    // Update the chart data to reflect the new colors
    setChartData(makeOptions(data.jsonData));

  }, [theme]);

  return (
    <div className="line">
      <div className="row max-h-screen">
        <div className="mixed-chart max-h-screen">
          {(typeof window !== 'undefined') &&
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={height}
            />
          }
        </div>
      </div>
    </div>
  );
}
