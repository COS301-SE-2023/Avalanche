import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { IChart } from '@/interfaces';
import { chartColours } from "@/components/Graphs/data";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
        },
        y: {
            beginAtZero: true,
        },
    },
};

export function BarChart({ data }: IChart) {
    let dataN = JSON.parse(JSON.stringify(data))
    assignColours(dataN)
    return <Bar options={options} data={dataN.chartData} />;
}
