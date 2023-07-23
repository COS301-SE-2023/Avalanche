export default interface IDomainNameAnalysisGraphRequest {
    granularity?: string,
    num?: number,
    minimumAppearances? : number,
    dateFrom? : string,
    zone? : string
}