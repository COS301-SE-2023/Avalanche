import { IChart } from "@/interfaces";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { chartColours } from "./data";
import { convertData } from "./util";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type JsonDataEntry = {
  [key: string]: string | number;
};

export function LineChart({ data, height }: IChart) {
  const { theme, setTheme } = useTheme();

  const makeOptions = (jsonData: JsonDataEntry[]) => {
    let allOptions = convertData(jsonData, "line", theme);

    //Set basic style
    let styleOptions = {
      dataLabels: {
        enabled: false,
        // colors: undefined, // This will use the series color for each data label
      },
      stroke: {
        show: true,
        curve: "monotoneCubic",
        lineCap: "butt",
        colors: undefined,
        dashArray: 0,
      },
      noData: {
        text: "We're sorry, we couldn't find any results...\r\nPlease try another set of filters",
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: -5,
        style: {
          color: undefined,
          fontSize: '18px',
          fontFamily: undefined
        }
      },
      chart: {
        zoom: {
          enabled: true,
          type: "xy",
          autoScaleYaxis: false,
          zoomedArea: {
            fill: {
              color: "#90CAF9",
              opacity: 0.4,
            },
            stroke: {
              color: "#0D47A1",
              opacity: 0.4,
              width: 1,
            },
          },
        },
        id: "basic-line",
        height: 100, // or any other fixed height
        width: "100%",
        toolbar: {
          show: true,
          tools: {
            download: false, // Display the download icon
            selection: true, // Display the selection icon
            zoom: true, // Display the zoom in and zoom out icons
            zoomin: false, // Display only the zoom in icon
            zoomout: false, // Display only the zoom out icon
            pan: false, // Display the panning icon
            reset: true, // Display the reset icon
          },
        },
      },
      tooltip: {
        theme: "dark", // or 'light'
        style: {
          backgroundColor: "red", // Background color for the tooltip
          color: "white", // Text color for the tooltip
          fontSize: "12px", // Font size for the tooltip
          fontFamily: "Arial", // Font family for the tooltip
        },
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 900,
        animateGradually: {
          enabled: true,
          delay: 300,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    } as any;

    //conditional style for Movement graph
    if (allOptions.options.yaxis.title.text == " Movement" && allOptions.series && allOptions.series.length == 1) {
      styleOptions.colors = ["#FF0000"] as string[];
      styleOptions.fill = {
        type: "gradient",
        gradient: {
          type: 'vertical',
          gradientToColors: ['#008000'],
          stops: [(Math.max(...allOptions.series[0].data) / (Math.max(...allOptions.series[0].data) - Math.min(...allOptions.series[0].data))) * 100, 0],
        }
      };
      styleOptions.tooltip.marker = {
        show: false,
      };
      let discreteMarkers = [];
      for (let index = 0; index < allOptions.series[0].data.length; index++) {
        let markerColour = "#008000";
        if (allOptions.series[0].data[index] <= 0) {
          markerColour = "#FF0000";
        }
        discreteMarkers.push({
          seriesIndex: 0,
          dataPointIndex: index,
          fillColor: markerColour,
          strokeColor: markerColour,
          size: 4, // Adjust the size as per your preference
          shape: "circle", // This will make the markers circular
          strokeWidth: 0,
          hover: {
            size: 6, // Adjust the size for hover state as per your preference
          },
        });

      }
      styleOptions.markers = {
        discrete: discreteMarkers
      }
    } else {
      styleOptions.colors = chartColours;
      styleOptions.markers = {
        size: 5, // Adjust the size as per your preference
        shape: "circle", // This will make the markers circular
        strokeWidth: 0,
        hover: {
          size: 7, // Adjust the size for hover state as per your preference
        },
      };
    }

    Object.assign(allOptions.options, styleOptions);
    return allOptions;
  };

  const [chartData, setChartData] = useState(makeOptions(data.jsonData));

  useEffect(() => {
    // Update the chart data to reflect the new colors
    setChartData(makeOptions(data.jsonData));
  }, [theme]);

  return (
    <div className="line">
      <div className="row min-h-full max-h-screen">
        <div className="mixed-chart max-h-screen">
          {typeof window !== "undefined" && (
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="line"
              height={height}
            />
          )}
        </div>
      </div>
    </div>
  );
}
