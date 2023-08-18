import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { IChart } from "@/interfaces";
import { chartColours } from "@/components/Graphs/data";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
const hexToRgba = (hex: string, alpha: number) => {
  const [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const assignColours = (payload: any) => {
  const datasets = payload.chartData.datasets;

  datasets.forEach((set: any, index: number) => {
    set.backgroundColor = set.data.map((_: any, dataIndex: number) =>
      hexToRgba(chartColours[dataIndex % chartColours.length], 0.6)
    );
    set.borderColor = chartColours[index % chartColours.length];
    set.pointRadius = 4;
    set.pointHoverRadius = 5;
  });
};

export function RadarChart({ data }: IChart) {
  let dataN = JSON.parse(JSON.stringify(data));
  assignColours(dataN);
  return <Radar data={dataN.chartData} />;
}
