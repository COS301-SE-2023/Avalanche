import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import React, { useRef, useEffect } from 'react';


const labels = ["January","February","March","April","May","June","July","August","September","October","November","December"];


Chart.register(...registerables);

/*const data = {

  labels: labels,

  datasets: [
  {
    label: 'AFRICA_NEW',
    data: [932,1286,1220,858,935,839,760,802,802,894,847,701],
    borderColor: 'rgb(75, 192, 192)',
    yAxisID: 'y',
  },
  {
    label: 'AFRICA_PREMIUM',
    data: [19,17,27,18,16,8,13,23,16,6,12,14],
    borderColor: 'rgb(75, 192, 192)',
    yAxisID: 'y',
  },
  {
    label: 'AFRICA_TRANSFER',
    data: [1147,1244,1147,1326,1785,2019,2691,2106,1298,1370,1155,1218],
    borderColor: 'rgb(75, 192, 192)',
    yAxisID: 'y',

  },
  {
    label: 'AFRICA_TRANSFER',
    data: [39,80,97,83,83,199,69,69,73,56,47,33],
    borderColor: 'rgb(75, 192, 192)',
    yAxisID: 'y',
  },
  {
    label: 'AFRICA_CLOSED_REDEEM',
    data: [6,5,0,40,19,36,29,22,15,22,24,25],
    borderColor: 'rgb(75, 192, 192)',
    yAxisID: 'y',
  },
  {
    label: 'AFRICA_GRACE',
    data: [5,10,5,5,4,5,3,4,5,12,6,3],
    borderColor: 'rgb(75, 192, 192)',
    yAxisID: 'y',
  }

  ]};*/

  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      },
      {
        label: '# of Points',
        data: [7, 11, 5, 8, 3, 7],
        borderWidth: 1
      }
    ]
  }

  const options = {
    maintainAspectRatio: false,
    elements: {
      point: {
        hoverRadius: 6,
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
  }

  const config = {
    type: 'line',
    data: data,
    options: options,
  };