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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

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
    console.log(data.chartData)
    return <Bar options={options} data={data.chartData} />;
}
