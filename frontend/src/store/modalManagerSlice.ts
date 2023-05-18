import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

export interface ModalManagerState {
    animateManager: boolean
}

const initialState: ModalManagerState = {
    animateManager: false,
}

export const modalManagerSlice = createSlice({
    name: "modalManager",
    initialState,
    reducers: {
        setAnimateManagerState(state, action) {
            state.animateManager = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action,
            };
        })
    }
});

export const { setAnimateManagerState } = modalManagerSlice.actions;

export const selectModalManagerState = (state: AppState) => state.modalManager.animateManager;

export default modalManagerSlice.reducer;