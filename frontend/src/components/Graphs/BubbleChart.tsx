import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { IChart } from '@/interfaces';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export const options = {
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

export function BubbleChart({ data }: IChart) {
    return <Bubble options={options} data={data.chartData} />;
}
