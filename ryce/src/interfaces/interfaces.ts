export interface DataInterface {
  chartData: any;
  jsonData: any;
}

export interface NewDataInterface {
  data: DataInterface;
  filters: any;
}

export function formatDate(input: string): string {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const date = new Date(input);
  const day = date.getDate(); // Gets the day of the month (1-31)
  const monthIndex = date.getMonth(); // Gets the month index (0-11)
  const year = date.getFullYear(); // Gets the year

  return `${day} ${monthNames[monthIndex]} ${year}`;
}

export enum ChartType {
  Pie = 'Pie',
  Line = 'Line',
  Bar = 'Bar',
  Bubble = 'Bubble',
  PolarArea = 'PolarArea',
  Radar = 'Radar',
  TreeMap = 'TreeMap'
}
