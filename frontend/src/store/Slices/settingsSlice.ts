import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "../store";

const url = `${process.env.NEXT_PUBLIC_API}/user-management`;

export const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        api: {

        }
    },
    reducers: {

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

export const { } = settingsSlice.actions;
export const settingsState = (state: AppState) => state.settings;
export default settingsSlice.reducer;