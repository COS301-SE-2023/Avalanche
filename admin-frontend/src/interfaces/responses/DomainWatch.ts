export interface IDomainWatchReturn {
    domainName: string,
    zone: string,
    similarity: number
}

export default interface IDomainWatchResponse {
    status: string,
    timestamp: string,
    data: IDomainWatchReturn[],
    searchTime: number
}