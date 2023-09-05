import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { IChart } from '@/interfaces';
import { chartColours } from "@/components/Graphs/data";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const assignColours = (payload: any) => {
    const datasets = payload.chartData.datasets;
  
    datasets.forEach((set: any, index: number) => {
      set.backgroundColor = chartColours[index % chartColours.length];
      set.borderColor = chartColours[index % chartColours.length];
      set.pointRadius = 4;
      set.pointHoverRadius = 5;
    });
  };

export const options = {
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

export function ScatterChart({ data }: IChart) {
    let dataN = JSON.parse(JSON.stringify(data))
    assignColours(dataN)
    return <Scatter options={options} data={dataN.chartData} />;
}
