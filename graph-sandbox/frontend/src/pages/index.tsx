import LineChart from "./LineChart";
import BarChart from "./BarChart"


const labels = ["January","February","March","April","May","June","July","August","September","October","November","December"];


const data = {
  labels: labels,
  datasets: [{
    label: 'AFRICA_NEW',
    data: [932,1286,1220,858,935,839,760,802,802,894,847,701],
    borderColor: 'rgba(54, 162, 235)', //blue
    backgroundColor: 'rgba(54, 162, 235)',
    borderWidth: 1,
    yAxisID: 'y',
  }]
}