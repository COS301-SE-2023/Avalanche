import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import { IChart } from '@/interfaces';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export function PolarAreaChart({ data }: IChart) {
    return <PolarArea data={data} />;
}
