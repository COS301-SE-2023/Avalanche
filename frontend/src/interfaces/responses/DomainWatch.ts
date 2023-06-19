interface IDomainWatchReturn {
    domainName: string,
    zone: string,
    similarity: 65
}

export default interface IDomainWatchResponse {
    status: string,
    timestamp: string,
    data: IDomainWatchReturn[],
    searchTime: number
}