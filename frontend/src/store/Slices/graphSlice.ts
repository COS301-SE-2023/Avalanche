import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky, { HTTPError } from "ky";
import { ITransactionGraphRequest } from "@/interfaces/requests";
import { getCookie } from "cookies-next";
import { chartColours } from "@/components/Graphs/data";
import IMarketShareGraphRequest from "@/interfaces/requests/MarketShareGraph";
import IDomainNameAnalysisGraphRequest from "@/interfaces/requests/DomainNameAnalysis";
import IAgeAnalysisGraphRequest from "@/interfaces/requests/AgeAnalysisGraph";
import IMovementGraphRequest from "@/interfaces/requests/Movement";
import * as Sentry from "@sentry/nextjs";

const url = `${process.env.NEXT_PUBLIC_API}`;

interface IGraphState {
    graphs: any[],
    loading: boolean
    latestAdd: number,
    filters: any[],
    selectedDataSource: string,
    error: string,
    zones: string[],
    cleared: boolean,
}

interface IZoneArr {
    africa: string[],
    zacr: string[],
    ryce: string[]
}

const zonesArr: IZoneArr = {
    africa: ["AFRICA"],
    zacr: ["CO.ZA", "ORG.ZA", "NET.ZA", "WEB.ZA"],
    ryce: ["WIEN", "TIROL", "KOELN", "COLOGNE"]
}

const initialState: IGraphState = {
    graphs: [],
    loading: false,
    latestAdd: -1,
    filters: [],
    selectedDataSource: "zacr",
    error: "",
    zones: zonesArr["zacr"],
    cleared: false
}

const assignColours = (payload: any) => {
    const datasets = payload.data.data.chartData.datasets;
};

export const graphSlice = createSlice({
    name: "graph",
    initialState,
    reducers: {
        addToGraphs(state, action) {
            const payload = action.payload as any;
            const temp = [...state.graphs];
            temp.push(payload);
            state.graphs = temp;
        },
        setLoading(state, action) {
            state.loading = action.payload as any;
        },
        selectDataSource(state, action) {
            state.selectedDataSource = action.payload as any;
            state.zones = zonesArr[state.selectedDataSource as keyof typeof zonesArr];
        },
        clearGraphData(state) {
            state.graphs = [];
            state.error = "";
            state.cleared = true;
        },
        clearError(state) {
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action,
            };
        })
        builder.addCase(getGraphData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getGraphData.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getGraphData.rejected, (state, action) => {
            state.loading = false;
            state.cleared = false;
            state.error = action.payload as string;
        })
        builder.addCase(getGraphDataRanking.fulfilled, (state, action) => {
            const payload = action.payload as any;
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getGraphRegistrarData.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getGraphRegistrarData.rejected, (state, action) => {
            state.loading = false;
            state.cleared = false;
            state.error = action.payload as string;
        })
        builder.addCase(getGraphRegistrarData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getGraphDataRanking.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getGraphDataRanking.rejected, (state, action) => {
            state.loading = false;
            state.cleared = false;
            state.error = action.payload as string;
        })
        builder.addCase(getMarketShareData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getMarketShareData.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getMarketShareData.rejected, (state, action) => {
            state.loading = false;
            state.cleared = false;
            state.error = action.payload as string;
        })
        builder.addCase(getAgeAnalysisData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getAgeAnalysisData.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getAgeAnalysisData.rejected, (state, action) => {
            state.loading = false;
            state.cleared = false;
            state.error = action.payload as string;
        })
        builder.addCase(getDomainNameAnalysisData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getDomainNameAnalysisData.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getDomainNameAnalysisData.rejected, (state, action) => {
            state.loading = false;
            state.cleared = false;
            state.error = action.payload as string;
        })
        builder.addCase(getDomainNameAnalysisClassificationData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getDomainNameAnalysisClassificationData.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getDomainNameAnalysisClassificationData.rejected, (state, action) => {
            state.loading = false;
            state.cleared = false;
            state.error = action.payload as string;
        })
        builder.addCase(getDomainLengthData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getMovementVerticalData.rejected, (state, action) => {
            state.loading = false;
            state.cleared = false;
            state.error = action.payload as string;
        })
        builder.addCase(getMovementVerticalData.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getMovementVerticalData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getDomainLengthData.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getDomainLengthData.rejected, (state, action) => {
            state.loading = false;
            state.cleared = false;
            state.error = action.payload as string;
        })
        builder.addCase(getGraphDataArray.fulfilled, (state, action) => {
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getGraphDataArray.pending, (state, action) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getGraphDataRankingArray.fulfilled, (state, action) => {
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getGraphDataRankingArray.pending, (state, action) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getGraphDataArray.rejected, (state, action) => {
            state.loading = false;
            state.cleared = false;
            state.error = action.payload as string;
        })
        builder.addCase(getMarketShareDataArray.fulfilled, (state, action) => {
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getMarketShareDataArray.pending, (state, action) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getMarketShareDataArray.rejected, (state, action) => {
            state.loading = false;
            state.cleared = false;
            state.error = action.payload as string;
        })
        builder.addCase(getAgeAnalysisDataArray.fulfilled, (state, action) => {
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getAgeAnalysisDataArray.pending, (state, action) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getDomainNameAnalysisDataArray.fulfilled, (state, action) => {
            state.loading = false;
        })
        builder.addCase(getDomainNameAnalysisDataArray.pending, (state, action) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getDomainNameAnalysisClassificationDataArray.fulfilled, (state, action) => {
            // const payload = action.payload as any;
            // state.graphs = payload;
            state.loading = false;
            state.cleared = false;
        })
        builder.addCase(getDomainNameAnalysisClassificationDataArray.pending, (state, action) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getFilters.fulfilled, (state, action) => {
            const payload = action.payload as any;
            state.loading = false;
            state.filters = payload;
            state.error = "";
            state.cleared = false;
        })
        builder.addCase(getFilters.pending, (state) => {
            state.filters = [];
            state.loading = true;
            state.error = "";
        })
        builder.addCase(getFilters.rejected, (state, action) => {
            state.loading = false;
            state.filters = [];
            state.error = action.payload as string;
        })
    }
})

export const getGraphData = createAsyncThunk("GRAPH.GetGraphData", async (object: ITransactionGraphRequest, { getState, rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        const response = await ky.post(`${url}/${selectedDataSource}/transactions`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getGraphRegistrarData = createAsyncThunk("GRAPH.GetGraphRegistrarData", async (object: ITransactionGraphRequest, { getState, rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        const response = await ky.post(`${url}/${selectedDataSource}/registrar`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        return rejectWithValue(newError.message);
    }
})

export const getGraphDataRanking = createAsyncThunk("GRAPH.GetGraphDataRanking", async (object: ITransactionGraphRequest, { getState, rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        const response = await ky.post(`${url}/${selectedDataSource.toLowerCase()}/transactions-ranking`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getMarketShareData = createAsyncThunk("GRAPH.GetMarketShareData", async (object: IMarketShareGraphRequest, { getState, rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        const response = await ky.post(`${url}/${selectedDataSource}/marketShare`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getAgeAnalysisData = createAsyncThunk("GRAPH.GetAgeAnalysisData", async (object: IAgeAnalysisGraphRequest, { getState, rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        const response = await ky.post(`${url}/${selectedDataSource}/age`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getDomainLengthData = createAsyncThunk("GRAPH.GetDomainLengthData", async (object: IDomainNameAnalysisGraphRequest, { getState, rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        const response = await ky.post(`${url}/${selectedDataSource}/domainNameAnalysis/length`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getMovementVerticalData = createAsyncThunk("GRAPH.GetMovementVerticalData", async (object: IMovementGraphRequest, { getState, rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        const response = await ky.post(`${url}/${selectedDataSource}/movement/vertical`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getDomainNameAnalysisData = createAsyncThunk("GRAPH.GetDomainNameAnalysisData", async (object: IDomainNameAnalysisGraphRequest, { getState, rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        const response = await ky.post(`${url}/${selectedDataSource}/domainNameAnalysis/count`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getDomainNameAnalysisClassificationData = createAsyncThunk("GRAPH.GetDomainNameAnalysisClassificationData", async (object: IDomainNameAnalysisGraphRequest, { getState, rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        const response = await ky.post(`${url}/${selectedDataSource}/domainNameAnalysis/classification`, {
            json: object, timeout: false,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getGraphDataArray = createAsyncThunk("GRAPH.GetGraphDataArray", async (object: ITransactionGraphRequest[], { getState, rejectWithValue }) => {
    try {
        const array: any[] = [];
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        for (let i = 0; i < object.length; i++) {
            const graph = object[i];
            const res: any = await ky.post(`${url}/${selectedDataSource}/transactions`, {
                json: graph,
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).json();
            res.data.data.chartData.datasets.forEach((set: any, index: number) => {
                set.backgroundColor = chartColours[index];
            })
            array.push(res.data);
            addToGraphs(res.data);
        }

        return array;

    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getDomainLenghtDataArray = createAsyncThunk("GRAPH.GetDomainLengthDataArray", async (object: IDomainNameAnalysisGraphRequest[], { getState, rejectWithValue }) => {
    try {
        const array: any[] = [];
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        for (let i = 0; i < object.length; i++) {
            const graph = object[i];
            const res: any = await ky.post(`${url}/${selectedDataSource}/domainNameAnalysis/length`, {
                json: graph,
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).json();
            res.data.data.chartData.datasets.forEach((set: any, index: number) => {
                set.backgroundColor = chartColours[index];
            })
            array.push(res.data);
            addToGraphs(res.data);
        }

        return array;

    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getMovementVerticalDataArray = createAsyncThunk("GRAPH.GetMovementVerticalDataArray", async (object: IMovementGraphRequest[], { getState, rejectWithValue }) => {
    try {
        const array: any[] = [];
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        for (let i = 0; i < object.length; i++) {
            const graph = object[i];
            const res: any = await ky.post(`${url}/${selectedDataSource}/movement/vertical`, {
                json: graph,
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).json();
            res.data.data.chartData.datasets.forEach((set: any, index: number) => {
                set.backgroundColor = chartColours[index];
            })
            array.push(res.data);
            addToGraphs(res.data);
        }

        return array;

    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getGraphDataRankingArray = createAsyncThunk("GRAPH.GetGraphDataRankingArray", async (object: ITransactionGraphRequest[], { getState, rejectWithValue }) => {
    try {
        const array: any[] = [];
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        for (let i = 0; i < object.length; i++) {
            const graph = object[i];
            const res: any = await ky.post(`${url}/${selectedDataSource}/transactions-ranking`, {
                json: graph,
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).json();
            res.data.data.chartData.datasets.forEach((set: any, index: number) => {
                set.backgroundColor = chartColours[index];
            })
            array.push(res.data);
            addToGraphs(res.data);
        }

        return array;

    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getMarketShareDataArray = createAsyncThunk("GRAPH.GetaMarketShareDataArray", async (object: IMarketShareGraphRequest[], { getState, rejectWithValue }) => {
    try {
        const array: any[] = [];
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        for (let i = 0; i < object.length; i++) {
            const graph = object[i];
            const res: any = await ky.post(`${url}/${selectedDataSource}/marketShare`, {
                json: graph,
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).json();
            res.data.data.chartData.datasets.forEach((set: any, index: number) => {
                set.backgroundColor = chartColours[index];
            })
            array.push(res.data);
            addToGraphs(res.data);
        }

        return array;

    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getAgeAnalysisDataArray = createAsyncThunk("GRAPH.GetAgeAnalysisDataArray", async (object: IAgeAnalysisGraphRequest[], { getState, rejectWithValue }) => {
    try {
        const array: any[] = [];
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        for (let i = 0; i < object.length; i++) {
            const graph = object[i];
            const res: any = await ky.post(`${url}/${selectedDataSource}/age`, {
                json: graph,
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).json();
            res.data.data.chartData.datasets.forEach((set: any, index: number) => {
                set.backgroundColor = chartColours[index];
            })
            array.push(res.data);
            addToGraphs(res.data);
        }

        return array;

    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getDomainNameAnalysisDataArray = createAsyncThunk("GRAPH.GetDomainNameAnalysisDataArray", async (object: IDomainNameAnalysisGraphRequest[], { getState, rejectWithValue }) => {
    try {
        const array: any[] = [];
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        for (let i = 0; i < object.length; i++) {
            const graph = object[i];
            const res: any = await ky.post(`${url}/${selectedDataSource}/domainNameAnalysis/count`, {
                json: graph,
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).json();
            res.data.data.chartData.datasets.forEach((set: any, index: number) => {
                set.backgroundColor = chartColours[index];
            })
            array.push(res.data);
            addToGraphs(res.data);
        }

        return array;

    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getDomainNameAnalysisClassificationDataArray = createAsyncThunk("GRAPH.GetDomainNameAnalysisClassificationDataArray", async (object: IDomainNameAnalysisGraphRequest[], { getState, rejectWithValue }) => {
    try {
        const array: any[] = [];
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        for (let i = 0; i < object.length; i++) {
            const graph = object[i];
            const res: any = await ky.post(`${url}/${selectedDataSource}/domainNameAnalysis/classification`, {
                json: graph, timeout: false,
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).json();
            res.data.data.chartData.datasets.forEach((set: any, index: number) => {
                set.backgroundColor = chartColours[index];
            })
            array.push(res.data);
            addToGraphs(res.data);
        }

        return array;

    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const getFilters = createAsyncThunk("GRAPH.GetFilters", async (object: any, { rejectWithValue }) => {
    try {

        const jwt = getCookie("jwt");
        const res: any = await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/getFilters`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return res.message;
    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        Sentry.captureException(newError);
        return rejectWithValue(newError.message);
    }
})

export const { addToGraphs, setLoading, selectDataSource, clearGraphData, clearError } = graphSlice.actions;
export const graphState = (state: AppState) => state.graph;
export default graphSlice.reducer;