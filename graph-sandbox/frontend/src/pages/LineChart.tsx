import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import React, { useRef, useEffect } from 'react';


const labels = ["January","February","March","April","May","June","July","August","September","October","November","December"];


Chart.register(...registerables);

  interface LineChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string,
      yAxisID: string;
    }[];
  }

  const LineChart = ({ data }: { data: LineChartData }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d') as CanvasRenderingContext2D;
        const chart = new Chart(ctx, {
          type: 'line',
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
  };

  export default LineChart;