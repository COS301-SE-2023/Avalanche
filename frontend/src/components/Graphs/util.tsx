type JsonDataEntry = {
  [key: string]: string | number;
};

type ConvertedData = {
  series: {
    name: string;
    data: number[];
  }[];
  options: {
    xaxis: {
      categories: string[];
      title: {
        text: string;
      };
    };
    yaxis: {
      title: {
        text: string;
      };
      min: number;
    };
  };
};

export function convertData(jsonData: JsonDataEntry[], type: string): any {
  if (
    type == "line" ||
    type == "bar" ||
    type == "column" ||
    type == "radar" ||
    type == "bubble"
  ) {
    if (jsonData.length > 0) {
      const firstEntryKeys = Object.keys(jsonData[0]);
      if (firstEntryKeys.length == 2) {
        return convertWithSingleSeries(jsonData);
      } else if (firstEntryKeys.length == 3) {
        return convertWithMultipleSeries(jsonData);
      } else if (firstEntryKeys.length == 4) {
        if (firstEntryKeys[2] == "Registrars") {
          return convertWithMultipleSeries(
            preprocessDataForCombinedSeries(jsonData)
          );
        }
      }
    }
  } else {
  }
}

export function convertWithMultipleSeries(
  jsonData: JsonDataEntry[]
): ConvertedData {
  const seriesMap: { [key: string]: { [key: string]: number } } = {};
  const xAxisSet = new Set<string>();
  const seriesSet = new Set<string>();
  let yMin = Infinity;
  let yMax = -Infinity;

  let xAxisLabel = "";
  let yAxisLabel = "";
  let seriesLabel = "";

  if (jsonData.length > 0) {
    const firstEntryKeys = Object.keys(jsonData[0]);
    xAxisLabel = firstEntryKeys[0];
    seriesLabel = firstEntryKeys[1];
    yAxisLabel = firstEntryKeys[2];
  }

  // Populate the seriesMap and collect unique xAxis and Series values
  jsonData.forEach((entry) => {
    const xAxis = entry[xAxisLabel] as string;
    const series = entry[seriesLabel] as string;
    const yAxis = entry[yAxisLabel] as number;

    xAxisSet.add(xAxis);
    seriesSet.add(series);

    if (!seriesMap[series]) {
      seriesMap[series] = {};
    }
    seriesMap[series][xAxis] = yAxis;

    yMin = Math.min(yMin, yAxis);
    yMax = Math.max(yMax, yAxis);
  });

  // Initialize the final object
  const convertedData: ConvertedData = {
    series: [],
    options: {
      xaxis: {
        categories: Array.from(xAxisSet),
        title: {
          text: xAxisLabel,
        },
      },
      yaxis: {
        title: {
          text: yAxisLabel,
        },
        min: Math.min(0, yMin),
      },
    },
  };

  // Populate the series data
  seriesSet.forEach((seriesName) => {
    const data: number[] = [];
    xAxisSet.forEach((xAxisValue) => {
      data.push(seriesMap[seriesName][xAxisValue] ?? 0);
    });
    convertedData.series.push({
      name: seriesName,
      data,
    });
  });

  return convertedData;
}

export function convertWithSingleSeries(
  jsonData: JsonDataEntry[]
): ConvertedData {
  const xAxisSet = new Set<string>();
  let yMin = Infinity;

  let xAxisLabel = "";
  let yAxisLabel = "";

  if (jsonData.length > 0) {
    const firstEntryKeys = Object.keys(jsonData[0]);
    xAxisLabel = firstEntryKeys[0];
    yAxisLabel = firstEntryKeys[1];
  }

  const seriesData: number[] = [];

  // Populate the xAxisSet and seriesData
  jsonData.forEach((entry) => {
    const xAxis = entry[xAxisLabel] as string;
    const yAxis = entry[yAxisLabel] as number;

    xAxisSet.add(xAxis);
    seriesData.push(yAxis);

    yMin = Math.min(yMin, yAxis);
  });

  // Initialize the final object
  const convertedData: ConvertedData = {
    series: [
      {
        name: "", // You can change this to any desired name for the series
        data: seriesData,
      },
    ],
    options: {
      xaxis: {
        categories: Array.from(xAxisSet),
        title: {
          text: xAxisLabel,
        },
      },
      yaxis: {
        title: {
          text: yAxisLabel,
        },
        min: Math.min(0, yMin),
      },
    },
  };

  return convertedData;
}

function preprocessDataForCombinedSeries(
  jsonData: JsonDataEntry[]
): JsonDataEntry[] {
  let preprocessedData: JsonDataEntry[] = [];
  let xAxisLabel = "";
  let series1Label = "";
  let series2Label = "";
  let yAxisLabel = "";

  if (jsonData.length > 0) {
    const firstEntryKeys = Object.keys(jsonData[0]);
    xAxisLabel = firstEntryKeys[0];
    series1Label = firstEntryKeys[1];
    series2Label = firstEntryKeys[2];
    yAxisLabel = firstEntryKeys[3];
  }

  jsonData.forEach((entry) => {
    const xAxis = entry[xAxisLabel] as string;
    const series1 = entry[series1Label] as string;
    const series2 = entry[series2Label] as string;
    const combinedSeries = `${series1}-${series2}`;
    const yAxis = entry[yAxisLabel] as number;

    const newDataEntry: JsonDataEntry = {
      [xAxisLabel]: xAxis,
      [combinedSeries]: combinedSeries,
      [yAxisLabel]: yAxis,
    };

    preprocessedData.push(newDataEntry);
  });

  return preprocessedData;
}
