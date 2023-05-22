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
  },{
    label: 'AFRICA_PREMIUM',
    data: [19,17,27,18,16,8,13,23,16,6,12,14],
    borderColor: 'rgba(153, 102, 255)', //purple
    backgroundColor: 'rgba(153, 102, 255)',
    borderWidth: 1,
    yAxisID: 'y',
  },{
    label: 'AFRICA_TRANSFER',
    data: [1147,1244,1147,1326,1785,2019,2691,2106,1298,1370,1155,1218],
    borderColor: 'rgba(255, 159, 64)', //orange
    backgroundColor: 'rgba(255, 159, 64)',
    borderWidth: 1,
    yAxisID: 'y',
  },{
    label: 'AFRICA_TRANSFER',
    data: [39,80,97,83,83,199,69,69,73,56,47,33],
    borderColor: 'rgba(50, 168, 82)', //yellow
    backgroundColor: 'rgba(50, 168, 82)',
    borderWidth: 1,
    yAxisID: 'y',
  },{
    label: 'AFRICA_CLOSED_REDEEM',
    data: [6,5,0,40,19,36,29,22,15,22,24,25],
    borderColor: 'rgba(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132)',
    borderWidth: 1,
    yAxisID: 'y',
  },{
    label: 'AFRICA_GRACE',
    data: [5,10,5,5,4,5,3,4,5,12,6,3],
    borderColor: 'rgba(75, 192, 192)', //green
    backgroundColor: 'rgba(75, 192, 192)',
    borderWidth: 1,
    yAxisID: 'y',
  }
]
}

function App() {
  return (
    <div style={{position: "relative", height:"80vh", width:"80vw"}}>
      <LineChart data = {data}/>
      <BarChart data = {data}/>
    </div>
  );
}
export default App;