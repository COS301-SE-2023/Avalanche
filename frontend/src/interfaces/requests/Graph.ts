interface IDateRange {
    number: number;
    granularity: 'day' | 'week' | 'month' | 'year';
}


export default interface IGraphRequest {
    endpoint: string,
    filters: {
        [key: string]: any,
        dateRange?: IDateRange,
    }
}