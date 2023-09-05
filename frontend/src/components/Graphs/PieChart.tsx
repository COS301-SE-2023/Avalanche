import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { IChart } from "@/interfaces";
import { chartColours } from "@/components/Graphs/data";

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const assignColours = (payload: any) => {
  const datasets = payload.chartData.datasets;

  datasets.forEach((set: any) => {
    set.backgroundColor = set.data.map(
      (_: any, dataIndex: number) =>
        chartColours[dataIndex % chartColours.length]
    );
    set.borderColor = set.backgroundColor; // Same as backgroundColor
    set.pointRadius = 4;
    set.pointHoverRadius = 5;
  });
};

export function PieChart({ data }: IChart) {
  console.log("Pie");
  let dataN = JSON.parse(JSON.stringify(data))
  assignColours(dataN)
  return <Pie options={options} data={dataN.chartData} />;
}
