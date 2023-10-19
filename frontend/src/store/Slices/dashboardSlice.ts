import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "../store";

interface InitState {
    columns: number
}

const initalState: InitState = {
    columns: 2
}

export const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: initalState,
    reducers: {
        updateColumn(state, action) {
            state.columns = action.payload;
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

export const { updateColumn } = dashboardSlice.actions;
export const dashboardState = (state: AppState) => state.dashboard;
export default dashboardSlice.reducer;