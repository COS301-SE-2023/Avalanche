import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import { DBData } from "@/interfaces/qbee/interfaces";
import { Node, Edge } from 'reactflow';
import { getCookie } from "cookies-next";
import ky, { HTTPError } from "ky";
import { ErrorToast, SuccessToast } from "@/components/Util";

interface IInitState {
    data: DBData[],
    tables: string[],
    columns: string[],
    edited: boolean,
    nodes: string[],
    edges: string[],
    returnData: any,
}

const InitState: IInitState = {
    data: [],
    tables: [],
    columns: [],
    edited: false,
    nodes: [],
    edges: [],
    returnData: '',
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
            state.nodes = action.payload;
        },
        setEdges(state, action) {
            state.edges = action.payload;
        },
        setReturnData(state, action) {
            state.returnData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action,
            };
        })
        builder.addCase(getData.fulfilled, (state, action) => {
            SuccessToast({ text: "Successfully saved 🐝 No actually this time 👀" })
        })
        builder.addCase(getData.pending, (state) => {
            SuccessToast({ text: "We're working on it 👀" })
        })
        builder.addCase(getData.rejected, (state, action) => {
            ErrorToast({ text: "🛑 We're gave up 🛑"})
        })
    }
})

export const { addData, clear, setEdited, setNodes, setEdges } = qbeeSlice.actions;
export const qbeeState = (state: AppState) => state.qbee;

export const getData = createAsyncThunk("QBEE.GetData", async (query: any, { rejectWithValue }) => {
    console.log('Getting data man' + '\n' + JSON.stringify(query))
    console.log(query)
    if(!query){
        return;
    }
    const data = {
        schema: 'transactionsDetail',
        dataSource: 'zacr',
        query: query
    }
    try {

        const jwt = getCookie("jwt");
        const res: any = await ky.post(`${process.env.NEXT_PUBLIC_API}/qbee/zarc`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            },
            json: data,
        }).json();
        return res.message;
    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        return rejectWithValue(newError.message);
    }
})

export const { setReturnData } = qbeeSlice.actions;
export default qbeeSlice.reducer;