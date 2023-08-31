import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { ITransactionGraphRequest } from "@/interfaces/requests";
import { getCookie } from "cookies-next";
import { chartColours } from "@/components/Graphs/data";
import IMarketShareGraphRequest from "@/interfaces/requests/MarketShareGraph";
import IDomainNameAnalysisGraphRequest from "@/interfaces/requests/DomainNameAnalysis";
import IAgeAnalysisGraphRequest from "@/interfaces/requests/AgeAnalysisGraph";
import IMovementGraphRequest from "@/interfaces/requests/Movement";

const url = `${process.env.NEXT_PUBLIC_API}`;

interface IGraphState {
    graphs: any[],
    loading: boolean
    latestAdd: number,
    filters: any[],
    selectedDataSource:string,
    error: string,
}

const initialState: IGraphState = {
    graphs: [],
    loading: false,
    latestAdd: -1,
    filters: [],
    selectedDataSource:"",
    error: ""
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
        })
        builder.addCase(getGraphData.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getGraphDataRanking.fulfilled, (state, action) => {
            const payload = action.payload as any;
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
        })
        builder.addCase(getGraphDataRanking.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getMarketShareData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
        })
        builder.addCase(getMarketShareData.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getAgeAnalysisData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            // state.graphs.push(payload.data);
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
        })
        builder.addCase(getAgeAnalysisData.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getDomainNameAnalysisData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            // state.graphs.push(payload.data);
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
        })
        builder.addCase(getDomainNameAnalysisData.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getDomainLengthData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            //state.graphs.push(payload.data);
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
        })
        builder.addCase(getMovementVerticalData.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getMovementVerticalData.fulfilled, (state, action) => {
            const payload = action.payload as any;
            //state.graphs.push(payload.data);
            assignColours(payload)
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
        })
        builder.addCase(getDomainLengthData.pending, (state) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getGraphDataArray.fulfilled, (state, action) => {
            // const payload = action.payload as any;
            // state.graphs = payload;
            state.loading = false;
        })
        builder.addCase(getGraphDataArray.pending, (state, action) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getGraphDataRankingArray.fulfilled, (state, action) => {
            // const payload = action.payload as any;
            // state.graphs = payload;
            state.loading = false;
        })
        builder.addCase(getGraphDataRankingArray.pending, (state, action) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getMarketShareDataArray.fulfilled, (state, action) => {
            // const payload = action.payload as any;
            // state.graphs = payload;
            state.loading = false;
        })
        builder.addCase(getMarketShareDataArray.pending, (state, action) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getAgeAnalysisDataArray.fulfilled, (state, action) => {
            // const payload = action.payload as any;
            // state.graphs = payload;
            state.loading = false;
        })
        builder.addCase(getAgeAnalysisDataArray.pending, (state, action) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getDomainNameAnalysisDataArray.fulfilled, (state, action) => {
            // const payload = action.payload as any;
            // state.graphs = payload;
            state.loading = false;
        })
        builder.addCase(getDomainNameAnalysisDataArray.pending, (state, action) => {
            state.loading = true;
            state.graphs = [];
        })
        builder.addCase(getFilters.fulfilled, (state, action) => {
            const payload = action.payload as any;
            state.loading = false;
            state.filters = payload;
            state.error = "";
        })
        builder.addCase(getFilters.pending, (state) => {
            state.filters = [];
            state.loading = true;
            state.error = "";
        })
        builder.addCase(getFilters.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as any;
            state.filters = [];
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
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getGraphDataRanking = createAsyncThunk("GRAPH.GetGraphDataRanking", async (object: ITransactionGraphRequest, { getState,rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        const response = await ky.post(`${url}/${selectedDataSource}/transactions-ranking`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getMarketShareData = createAsyncThunk("GRAPH.GetMarketShareData", async (object: IMarketShareGraphRequest, {getState, rejectWithValue }) => {
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
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getAgeAnalysisData = createAsyncThunk("GRAPH.GetAgeAnalysisData", async (object: IAgeAnalysisGraphRequest, { getState,rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const state = getState() as { graph: IGraphState }; // Replace 'graph' with the slice name if different
        const { selectedDataSource } = state.graph;
        const response = await ky.post(`${url}/${selectedDataSource}//age`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getDomainLengthData = createAsyncThunk("GRAPH.GetDomainLengthData", async (object: IDomainNameAnalysisGraphRequest, { getState,rejectWithValue }) => {
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
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getMovementVerticalData = createAsyncThunk("GRAPH.GetMovementVerticalData", async (object: IMovementGraphRequest, {getState,rejectWithValue }) => {
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
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getDomainNameAnalysisData = createAsyncThunk("GRAPH.GetDomainNameAnalysisData", async (object: IDomainNameAnalysisGraphRequest, { getState,rejectWithValue }) => {
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
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getGraphDataArray = createAsyncThunk("GRAPH.GetGraphDataArray", async (object: ITransactionGraphRequest[], { getState,rejectWithValue }) => {
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
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getDomainLenghtDataArray = createAsyncThunk("GRAPH.GetDomainLengthDataArray", async (object: IDomainNameAnalysisGraphRequest[], { getState,rejectWithValue }) => {
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
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getMovementVerticalDataArray = createAsyncThunk("GRAPH.GetMovementVerticalDataArray", async (object: IMovementGraphRequest[], { getState,rejectWithValue }) => {
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
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getGraphDataRankingArray = createAsyncThunk("GRAPH.GetGraphDataRankingArray", async (object: ITransactionGraphRequest[], { getState,rejectWithValue }) => {
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
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getMarketShareDataArray = createAsyncThunk("GRAPH.GetaMarketShareDataArray", async (object: IMarketShareGraphRequest[], { getState,rejectWithValue }) => {
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
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getAgeAnalysisDataArray = createAsyncThunk("GRAPH.GetAgeAnalysisDataArray", async (object: IAgeAnalysisGraphRequest[], {getState, rejectWithValue }) => {
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
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getDomainNameAnalysisDataArray = createAsyncThunk("GRAPH.GetDomainNameAnalysisDataArray", async (object: IDomainNameAnalysisGraphRequest[], { getState,rejectWithValue }) => {
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
        if (e instanceof Error) return rejectWithValue(e.message);
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
        //console.log(res.message)
        return res.message;
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const { addToGraphs, setLoading,selectDataSource } = graphSlice.actions;
export const graphState = (state: AppState) => state.graph;
export default graphSlice.reducer;