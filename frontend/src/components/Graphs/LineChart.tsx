import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { IChart } from '@/interfaces';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export function LineChart({ data, addClass }: IChart) {
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
    };
    return <div className={`${addClass}`}><Line options={options} data={data} /></div>;
}
