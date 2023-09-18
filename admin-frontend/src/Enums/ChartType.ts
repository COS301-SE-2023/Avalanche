export enum ChartType {
    Pie = "Pie",
    Line = "Line",
    Bar = "Bar",
    Bubble = "Bubble",
    PolarArea = "PolarArea",
    Radar = "Radar"
}

export const ChartTypeArray: any[] = [
    {
        name: "Pie",
        type: ChartType.Pie
    },
    {
        name: "Line",
        type: ChartType.Line
    },
    {
        name: "Bar",
        type: ChartType.Bar
    },
    {
        name: "Bubble",
        type: ChartType.Bubble
    },
    {
        name: "Polar Area",
        type: ChartType.PolarArea
    },
    {
        name: "Radar",
        type: ChartType.Radar
    }
]

export const getFilteredChartTypes = (datasetSize: number) => {
    if (datasetSize > 1) {
      return ChartTypeArray.filter(chart => 
        [ChartType.Line, ChartType.Bar, ChartType.Bubble].includes(chart.type)
      );
    }
    return ChartTypeArray;
};