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
}

export default BarChart;