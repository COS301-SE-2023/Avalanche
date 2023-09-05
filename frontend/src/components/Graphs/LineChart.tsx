import { IChart } from "@/interfaces";
import React, { useState } from "react";
import Chart from "react-apexcharts";

export function LineChart({ data, addClass }: IChart) {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      }
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      },
      {
        name: "series-2",
        data: [3, 4, 4, 5, 4, 6, 7, 9]
      }
    ]
  });

  return (
    <div className="line">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="line"
          />
        </div>
      </div>
    </div>
  );
}
