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
} from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { IChart } from '@/interfaces';
import { useTheme } from 'next-themes'

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
    const { theme } = useTheme()
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
            zeroLineColor: "dark" ? "white" : "rgba(49, 54, 56, 0.5)"
        },
        scales: {
            y: {
                ticks: {
                    padding: 10
                },
                grid: {
                    color: theme === "dark" ? "rgba(49, 54, 56, 0.7)" : "rgba(49, 54, 56, 0.2)"
                }
            },
            x: {
                ticks: {
                    padding: 10
                },
                label: {
                    padding: 10
                },
                grid: {
                    color: theme === "dark" ? "rgba(49, 54, 56, 0.7)" : "rgba(49, 54, 56, 0.2)"
                }
            },

        }
    };
    return <div className={`${addClass}`}><Line options={options} data={data} /></div >;
}
