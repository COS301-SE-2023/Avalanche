import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import React, { useRef, useEffect } from 'react';


const labels = ["January","February","March","April","May","June","July","August","September","October","November","December"];


Chart.register(...registerables);

interface BarChartData {    
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string,
    yAxisID: string;
    borderWidth: number
  }[];
}

const BarChart = ({ data }: { data: BarChartData }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d') as CanvasRenderingContext2D;
      const chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Total Transactions'
            } 
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
            },
            y: {
              display: true,
            },
          },
        },
      });
      return () => chart.destroy();
    }
  }, [data]);

  return <canvas ref={chartRef} />;
}

export default BarChart;