import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { IChart } from "@/interfaces";
import { chartColours } from "@/components/Graphs/data";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const hexToRgba = (hex: string, alpha: number) => {
  const [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const assignColours = (payload: any) => {
  const datasets = payload.chartData.datasets;

  datasets.forEach((set: any) => {
    set.backgroundColor = set.backgroundColor = set.data.map(
      (_: any, dataIndex: number) =>
        hexToRgba(chartColours[dataIndex % chartColours.length], 0.6)
    );
    set.borderColor = set.data.map(
      (_: any, dataIndex: number) =>
        chartColours[dataIndex % chartColours.length]
    ); // Same as backgroundColor
    set.pointRadius = 4;
    set.pointHoverRadius = 5;
  });
};

export function PolarAreaChart({ data }: IChart) {
  let dataN = JSON.parse(JSON.stringify(data));
  assignColours(dataN);
  return <PolarArea data={dataN.chartData} />;
}
