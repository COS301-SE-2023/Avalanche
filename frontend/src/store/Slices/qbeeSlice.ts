import { ErrorToast, SuccessToast } from "@/components/Util";
import { DBData } from "@/interfaces/qbee/interfaces";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import ky, { HTTPError } from "ky";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "../store";

interface IInitState {
    data: DBData[],
    tables: string[],
    columns: string[],
    edited: boolean,
    nodes: string[],
    edges: string[],
    returnData: any,
    loading: boolean,
    error: string,
    outputData: any[],
    schema: string
}

const InitState: IInitState = {
    data: [],
    tables: [],
    columns: [],
    edited: false,
    nodes: [],
    edges: [],
    returnData: '',
    loading: false,
    error: '',
    outputData: [],
    schema: 'transactionsDetail'
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
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setSchema(state, action) {
            state.schema = action.payload as string;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action,
            };
        });
        builder.addCase(getData.fulfilled, (state, action) => {
            SuccessToast({ text: "Successfully saved 🐝" })
            state.loading = false;
            state.outputData = action.payload;
        })
        builder.addCase(getData.pending, (state) => {
            state.loading = true;
            state.outputData = [];
        })
        builder.addCase(getData.rejected, (state, action) => {
            ErrorToast({ text: "🛑 Hmmm something went wrong 🛑" })
            state.loading = false;
            state.error = action.payload as string;
        })
        builder.addCase(getSchema.fulfilled, (state, action) => {
            state.data = action.payload;
            action.payload.forEach((item: DBData) => {
                state.columns.push(item.columnName);
            })

            state.loading = false;
        })
        builder.addCase(getSchema.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            ErrorToast({ text: `There was an error getting the schema for ${state.schema}. Please select another Data Type.` })
        })
        builder.addCase(getSchema.pending, (state) => {
            state.loading = true;
            state.error = "";
        })
    }
})

export const getSchema = createAsyncThunk("QBEE.GetSchema", async (schema: string, { rejectWithValue, getState }) => {
    try {
        const jwt = getCookie("jwt");
        const res: any = await ky.post(`${process.env.NEXT_PUBLIC_API}/qbee/getSchema`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            },
            json: {
                schema: schema,
                dataSource: "zacr"
            },
        }).json();
        return res.message;
    } catch (e) {
        let error = e as HTTPError;
        const newError = await error.response.json();
        return rejectWithValue(newError.message);
    }
})

export const getData = createAsyncThunk("QBEE.GetData", async (query: any, { rejectWithValue, getState }) => {
    if (!query.query) {
        rejectWithValue("No query provided.");
    }
    const data = {
        schema: query.schema,
        dataSource: 'zacr',
        query: query.query
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

export const { addData, clear, setEdited, setNodes, setEdges, setReturnData, setSchema } = qbeeSlice.actions;
export const qbeeState = (state: AppState) => state.qbee;
export default qbeeSlice.reducer;