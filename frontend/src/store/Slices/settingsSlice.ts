import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { ICreateOrganisationRequest } from "@/interfaces/requests";
import { ICreateOrgnisationResponse } from "@/interfaces/responses";

const url = "http://localho.st:4000/user-management";

export const settingsSlice = createSlice({
    name: "settings",
    initialState: {

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