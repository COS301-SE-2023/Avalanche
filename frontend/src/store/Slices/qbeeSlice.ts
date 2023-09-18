import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import { DBData } from "@/interfaces/qbee/interfaces";

interface ITable {
    column: string
}
interface IInitState {
    data: DBData[],
    tables: string[],
    columns: string[]
}

const InitState: IInitState = {
    data: [],
    tables: [],
    columns: []
}

export const qbeeSlice = createSlice({
    name: "qbee",
    initialState: InitState,
    reducers: {
        addData(state, action) {
            state.data = action.payload;

            action.payload.filter((item: DBData) => {
                if (!state.tables.includes(item.table)) state.tables.push(item.table);
            })
        },
        selectTable(state, action) {
            state.data.forEach((item: DBData) => {
                if (item.table === action.payload) state.columns.push(item.columnName);
            })
        },
        clear(state) {
            state.data = [];
            state.tables = [];
            state.columns = [];
        },
        filterableData(state, action) {

        },
        addToFilterable(state, action) {

        }
    },
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action,
            };
        })
    }
})

export const { addData, selectTable, clear, addToFilterable } = qbeeSlice.actions;
export const qbeeState = (state: AppState) => state.qbee;
export default qbeeSlice.reducer;