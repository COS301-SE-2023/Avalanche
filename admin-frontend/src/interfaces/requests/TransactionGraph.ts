export default interface ITransactionGraphRequest {
    registrar?: string[],
    zone?: string[],
    dateFrom?: string //format yyyy-mm-dd
    dateTo?: string //format yyyy-mm-dd
    granularity?: string //year, month, week
    group?: string,
    transactions?: string[],
    graphName: string
}