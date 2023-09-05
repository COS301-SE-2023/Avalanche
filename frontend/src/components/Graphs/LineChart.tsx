import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { IChart } from "@/interfaces";
import { useTheme } from "next-themes";
import { chartColours } from "@/components/Graphs/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const assignColours = (payload: any) => {
  const datasets = payload.chartData.datasets;

  datasets.forEach((set: any, index: number) => {
    set.backgroundColor = chartColours[index % chartColours.length];
    set.borderColor = chartColours[index % chartColours.length];
    set.pointRadius = 4;
    set.pointHoverRadius = 5;
  });
};

export function LineChart({ data, addClass }: IChart) {
  const { theme } = useTheme();
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: data.datasets?.length === 1 ? false : true,
      },
      title: {
        display: false,
      },
    },
    gridLines: {
      zeroLineColor: "dark" ? "white" : "rgba(49, 54, 56, 0.5)",
    },
    scales: {
      y: {
        ticks: {
          padding: 10,
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(49, 54, 56, 0.7)"
              : "rgba(49, 54, 56, 0.2)",
        },
        beginAtZero: true,
      },
      x: {
        ticks: {
          padding: 10,
        },
        label: {
          padding: 10,
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(49, 54, 56, 0.7)"
              : "rgba(49, 54, 56, 0.2)",
        },
      },
    },
  };
  let dataN = JSON.parse(JSON.stringify(data))
  assignColours(dataN)
  return (
    <div className={`${addClass}`}>
      <Line options={options} data={dataN.chartData} />
    </div>
  );
}
