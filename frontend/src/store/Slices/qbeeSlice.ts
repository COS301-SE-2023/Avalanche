import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import { DBData } from "@/interfaces/qbee/interfaces";

interface IInitState {
    data: DBData[]
}

const InitState: IInitState = {
    data: []
}

export const qbeeSlice = createSlice({
    name: "qbee",
    initialState: InitState,
    reducers: {
        addData(state, action) {
            state.data = action.payload;
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

export const { addData } = qbeeSlice.actions;
export const qbeeState = (state: AppState) => state.qbee;
export default qbeeSlice.reducer;