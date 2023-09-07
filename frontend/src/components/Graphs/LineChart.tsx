import { IChart } from "@/interfaces";
import React, { useState , useEffect} from "react";
import dynamic from "next/dynamic";
import { json } from "stream/consumers";
import { chartColours } from "./data";
import { convertData } from "./util";
import { useTheme } from "next-themes";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });


type JsonDataEntry = {
  [key: string]: string | number;
};

export function LineChart({ data, height }: IChart) {
  const { theme, setTheme } = useTheme();

  const makeOptions = (jsonData: JsonDataEntry[]) => {
    let allOptions = convertData(jsonData, "line", theme);
    Object.assign(allOptions.options, {
      dataLabels: {
        enabled: false,
        colors: undefined, // This will use the series color for each data label
      },
      colors: chartColours,
      stroke: {
        show: true,
        curve: "smooth",
        lineCap: "butt",
        colors: undefined,
        dashArray: 0,
      },
      chart: {
        zoom: {
          enabled: true,
          type: "x",
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
        type: "area",
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
      markers: {
        size: 5, // Adjust the size as per your preference
        shape: "circle", // This will make the markers circular
        strokeWidth: 0,
        hover: {
          size: 7, // Adjust the size for hover state as per your preference
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
    });
    return allOptions;
  };

  const [chartData, setChartData] = useState(makeOptions(data.jsonData));

  useEffect(() => {
    // Update the chart data to reflect the new colors
    setChartData(makeOptions(data.jsonData));

  }, [theme]); 

  return (
    <div className="line">
      <div className="row max-h-screen">
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
