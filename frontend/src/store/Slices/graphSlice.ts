import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { ITransactionGraphRequest } from "@/interfaces/requests";
import { getCookie } from "cookies-next";
import { chartColours } from "@/components/Graphs/data";

const url = "http://localhost:4000/zacr";

interface IGraphState {
    graphs: any[],
    loading: boolean
    latestAdd: number
}

const initialState: IGraphState = {
    graphs: [],
    loading: false,
    latestAdd: -1,
}

export const graphSlice = createSlice({
    name: "graph",
    initialState,
    reducers: {
        addToGraphs(state, action) {
            const payload = action.payload as any;
            const temp = [...state.graphs];
            temp.push(payload);
            state.graphs = temp;
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
            payload.data.datasets.forEach((set: any, index: number) => {
                set.backgroundColor = chartColours[index];
            })
            state.graphs.push(payload.data);
            state.latestAdd = state.graphs.length - 1;
            state.loading = false;
        })
        builder.addCase(getGraphData.pending, (state) => {
            state.loading = true;
            // state.graphs = [];
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
    }
})

export const getGraphData = createAsyncThunk("GRAPH.GetGraphData", async (object: ITransactionGraphRequest, { rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const response = await ky.post(`${url}/transactions`, {
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

export const getGraphDataArray = createAsyncThunk("GRAPH.GetGraphDataArray", async (object: ITransactionGraphRequest[], { rejectWithValue }) => {
    try {
        const array: any[] = [];
        const jwt = getCookie("jwt");
        for (let i = 0; i < object.length; i++) {
            const graph = object[i];
            const res: any = await ky.post(`${url}/transactions`, {
                json: graph,
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).json();
            res.data.datasets.forEach((set: any, index: number) => {
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

export const { addToGraphs } = graphSlice.actions;
export const graphState = (state: AppState) => state.graph;
export default graphSlice.reducer;