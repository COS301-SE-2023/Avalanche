interface IGraphRequest {
    "endpoint": string,
    "filters": {
        [key: string]: any
    }
}

export default interface IDashboardGraphResponse {
    "status": string,
    "message":
    {
        "dashboardGraphs": IGraphRequest[]
    }

}