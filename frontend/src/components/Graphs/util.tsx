import { useEffect } from "react";

const themeColours = {
  labelColour: "",
};

type JsonDataEntry = {
  [key: string]: string | number | string[];
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
        style: {
          color: string;
        };
      };
      tooltip: {
        enabled: boolean;
      };
      labels: {
        style: {
          colors: string;
        };
      };
    };
    yaxis: {
      forceNiceScale: boolean;
      title: {
        text: string;
        style: {
          color: string;
        };
      };
      min: number;
      tooltip: {
        enabled: false;
      };
      labels: {
        style: {
          colors: string;
        };
        formatter: any;
      };
    };
    legend: {
      labels: {
        colors: string;
      };
      position: string;
      horizontalAlign: string;
      height: number;
      itemMargin: {
        horizontal: number; // Adjust as needed
        vertical: number; // Adjust as needed
      };
      fontSize: any;
    };
    annotations?: {
      yaxis: 
        {
          y: number; // replace with the y-value where you want the line
          borderColor: string; // color of the line
          
        }[]
      ;
    };
  };
};

type ProportionConvertedData = {
  series: number[];
  options: {
    labels: string[];
  };
};

type TreeConvertedData = {
  series: {
    data: {
      x: string | number;
      y: number;
    }[];
  }[];
  options: {};
};

const camelCaseRenderer = (value: string) => {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
}

export function convertData(
  jsonData: JsonDataEntry[],
  type: string,
  theme: string | undefined
): any {
  //Set theme colour

  if (theme === "dark") {
    themeColours.labelColour = "#000000";
  } else {
    themeColours.labelColour = "#000000";
  }

  //Clean the data returned with word arrays
  if (jsonData.length > 0) {
    const firstEntryKeys = Object.keys(jsonData[0]);
    if (
      firstEntryKeys.length == 3 &&
      typeof jsonData[0][firstEntryKeys[2]] == "object"
    ) {
      jsonData = jsonData.map((entry) => {
        const { [Object.keys(entry)[2]]: _, ...rest } = entry;
        return rest;
      });
    }
  }

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
        return convertWithSingleSeries(jsonData, type);
      } else if (firstEntryKeys.length == 3) {
        return convertWithMultipleSeries(jsonData, type);
      } else if (firstEntryKeys.length == 4) {
        if (firstEntryKeys[2] == "Registrars") {
          return convertWithMultipleSeries(
            preprocessDataForCombinedSeries(jsonData), type
          );
        }
      }
    }
  } else if (type == "pie" || type == "polarArea") {
    if (jsonData.length > 0) {
      const firstEntryKeys = Object.keys(jsonData[0]);
      if (firstEntryKeys.length == 2) {
        return convertForProportion(jsonData);
      }
    }
  } else if (type == "tree") {
    if (jsonData.length > 0) {
      const firstEntryKeys = Object.keys(jsonData[0]);
      if (firstEntryKeys.length == 2) {
        return convertForTree(jsonData);
      }
    }
  }
}

function convertWithMultipleSeries(jsonData: JsonDataEntry[], type: string): ConvertedData {
  jsonData = [...jsonData]
  const seriesMap: { [key: string]: { [key: string]: number } } = {};
  const xAxisSet = new Set<string>();
  const seriesSet = new Set<string>();
  let yMin = Infinity;
  let yMax = -Infinity;

  let xAxisLabel:any = "";
  let yAxisLabel:any = "";
  let seriesLabel: any = "";

  if (jsonData.length > 0) {
    xAxisLabel = jsonData[0].xAxis;
    yAxisLabel = jsonData[0].yAxis;
    seriesLabel = jsonData[0].series;
  }

  jsonData.splice(0,1);

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

  var annotationsToUse;
  if(type != 'radar'){
    annotationsToUse = {
      yaxis: [
        
        {
          y: 0,
          borderColor: "#000000", // Black color
          
        },
      ],
    }
  }

  // Initialize the final object
  const convertedData: ConvertedData = {
    series: [],
    options: {
      xaxis: {
        categories: Array.from(xAxisSet),
        title: {
          text: camelCaseRenderer(xAxisLabel),
          style: {
            color: themeColours.labelColour,
          },
        },
        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            colors: themeColours.labelColour,
          },
        },
      },
      yaxis: {
        
        forceNiceScale: true,
        title: {
          text: camelCaseRenderer(yAxisLabel),
          style: {
            color: themeColours.labelColour,
          },
        },
        min: Math.min(0, yMin),
        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            colors: themeColours.labelColour, // e.g., '#FFFFFF' for white
          },
          formatter: (val: number): string => {
            return val?.toLocaleString();
          },
        },
      },
      legend: {
        labels: {
          colors: themeColours.labelColour,
        },
        position: "bottom",
        horizontalAlign: "left",
        height: 50,
        fontSize: "12px",
        itemMargin: {
          horizontal: 15, // Adjust as needed
          vertical: 2, // Adjust as needed
        },
      },
      ...(annotationsToUse ? { annotations: annotationsToUse } : {}) 
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

function convertWithSingleSeries(jsonData: JsonDataEntry[], type: string): ConvertedData {
  jsonData = [...jsonData];
  const xAxisSet = new Set<string>();
  let yMin = Infinity;

  let xAxisLabel: any = "";
  let yAxisLabel: any = "";

  if (jsonData.length > 0) {
    xAxisLabel = jsonData[0].xAxis;
    yAxisLabel = jsonData[0].yAxis;
  }

  jsonData.splice(0,1);
  const seriesData: number[] = [];

  // Populate the xAxisSet and seriesData
  jsonData.forEach((entry) => {
    const xAxis = entry[xAxisLabel] as string;
    const yAxis = entry[yAxisLabel] as number;

    xAxisSet.add(xAxis);
    seriesData.push(yAxis);

    yMin = Math.min(yMin, yAxis);
  });

  var annotationsToUse;
  if(type != 'radar'){
    annotationsToUse = {
      yaxis: [
        {
          y: 0,
          borderColor: "#000000", // Black color
          
        },
      ],
    }
  }
  
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
          text: camelCaseRenderer(xAxisLabel),
          style: {
            color: themeColours.labelColour,
          },
        },
        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            colors: themeColours.labelColour,
          },
        },
      },
      yaxis: {
        forceNiceScale: true,
        title: {
          text: camelCaseRenderer(yAxisLabel),
          style: {
            color: themeColours.labelColour,
          },
        },
        min: Math.min(0, yMin),
        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            colors: themeColours.labelColour,
          },
          formatter: (val: number): string => {
            return val?.toLocaleString();
          },
        },
      },
      legend: {
        labels: {
          colors: themeColours.labelColour,
        },
        position: "bottom",
        horizontalAlign: "left",
        itemMargin: {
          horizontal: 15, // Adjust as needed
          vertical: 5, // Adjust as needed
        },
        height: 10,
        fontSize: "12px",
      },
      ...(annotationsToUse ? { annotations: annotationsToUse } : {}) 
    },
  };

  


  return convertedData;
}

export function convertForProportion(
  jsonData: JsonDataEntry[]
): ProportionConvertedData {
  jsonData = [...jsonData];
  const xAxisValues: string[] = [];
  const yAxisValues: number[] = [];

  let xAxisLabel:any = "";
  let yAxisLabel:any = "";

  if (jsonData.length > 0) {
    xAxisLabel = jsonData[0].xAxis;
    yAxisLabel = jsonData[0].yAxis;
  }

  jsonData.splice(0,1)

  jsonData.forEach((entry) => {
    xAxisValues.push(entry[xAxisLabel] as string);
    yAxisValues.push(entry[yAxisLabel] as number);
  });

  return {
    series: yAxisValues,
    options: {
      labels: xAxisValues,
    },
  };
}

export function convertForTree(jsonData: JsonDataEntry[]): TreeConvertedData {
  console.log("json",jsonData);
  const seriesData: { x: any; y: any }[] = [];

  let xAxisLabel:any = "";
  let yAxisLabel:any = "";

  if (jsonData.length > 0) {
    xAxisLabel = jsonData[0].xAxis;
    yAxisLabel = jsonData[0].yAxis;
  }
  
  jsonData.forEach((entry) => {
    console.log(xAxisLabel,entry[xAxisLabel],typeof entry[xAxisLabel]," <-- x");
    console.log(yAxisLabel,entry[yAxisLabel],typeof entry[yAxisLabel]," <-- y");
    if (
      (typeof entry[xAxisLabel] == "string" ||
        typeof entry[xAxisLabel] == "number") &&
      typeof entry[yAxisLabel] == "number"
    ) {
      seriesData.push({
        x: entry[xAxisLabel],
        y: entry[yAxisLabel],
      });
    }
  });

  return {
    series: [
      {
        data: seriesData,
      },
    ],
    options: {},
  };
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
      series: combinedSeries,
      [yAxisLabel]: yAxis,
    };

    preprocessedData.push(newDataEntry);
  });
  return preprocessedData;
}
