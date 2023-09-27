export interface IDomainWatchType {
    type: string,
    threshold: number
}

export default interface IDomainWatchRequest {
    domain: string,
    types: IDomainWatchType[],
    resolve: boolean
}