export default interface ITransactionGraphRequest {
    zone?: string,
    granularity?: string,
    group?: string,
    dateFrom?: string,
    transactions?: string[],
    graphName: string
}