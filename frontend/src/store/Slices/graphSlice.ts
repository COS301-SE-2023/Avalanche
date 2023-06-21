import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { ITransactionGraphRequest } from "@/interfaces/requests";
import { getCookie } from "cookies-next";
import { chartColours } from "@/components/Graphs/data";

const url = "http://localhost:4000/zacr";

interface IGraphState {
    graphs: any[]
}

const initialState: IGraphState = {
    graphs: []
}

export const graphSlice = createSlice({
    name: "graph",
    initialState,
    reducers: {

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
            const temp = [...state.graphs];
            temp.push(payload.data);
            temp.forEach(item => {
                const length = item.datasets.length;
                const colours = chartColours.splice(0, length);
                console.log(colours);
                item.datasets.forEach((set: any) => {
                    set.backgroundColor = colours;
                })
            })
            state.graphs = temp;
        })
        builder.addCase(getGraphData.pending, (state) => {

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

export const { } = graphSlice.actions;
export const graphState = (state: AppState) => state.graph;
export default graphSlice.reducer;