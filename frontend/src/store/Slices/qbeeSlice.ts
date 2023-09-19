import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import { DBData } from "@/interfaces/qbee/interfaces";
import { Node, Edge } from 'reactflow';

interface IInitState {
    data: DBData[],
    tables: string[],
    columns: string[],
    edited: boolean,
    nodes: any,
    edges: any,
}

const InitState: IInitState = {
    data: [],
    tables: [],
    columns: [],
    edited: false,
    nodes: [],  // Initial value for nodes
    edges: [],
}

export const qbeeSlice = createSlice({
    name: "qbee",
    initialState: InitState,
    reducers: {
        addData(state, action) {
            state.data = action.payload;

            action.payload.forEach((item: DBData) => {
                state.columns.push(item.columnName);
            })
        },
        clear(state) {
            state.data = [];
            state.tables = [];
            state.columns = [];
        },
        setEdited(state, action) {
            state.edited = action.payload;
        },
        setNodes(state, action) {
            console.log("boi");
            // state.nodes = action.payload;
        },
        setEdges(state, action) {
            state.edges = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action,
            };
        })
        // builder.addCase(setNodes.fulfilled, (state, action) => {
        //     state.nodes = action.payload as any;
        // })
        // builder.addCase(setEdges.fulfilled, (state, action) => {
        //     state.edges = action.payload as any;
        // })
    }
})

// export const setNodes = createAsyncThunk("QBEE.SetNodes", async (data, { rejectWithValue }) => {
//     try {
//         return data;
//     } catch (e) {
//         if (e instanceof Error) return rejectWithValue(e.message);
//     }
// })

// export const setEdges = createAsyncThunk("QBee.SetEdges", async (data, { rejectWithValue }) => {
//     try {
//         return data;
//     } catch (e) {
//         if (e instanceof Error) return rejectWithValue(e.message);
//     }
// })

export const { addData, clear, setEdited, setNodes, setEdges } = qbeeSlice.actions;
export const qbeeState = (state: AppState) => state.qbee;
export default qbeeSlice.reducer;