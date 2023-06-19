import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { IDomainWatchRequest } from "@/interfaces/requests";
import { IDomainWatchResponse } from "@/interfaces/responses";

export const domainWatchSlice = createSlice({
    name: "domainWatch",
    initialState: {
        loading: false,
        data: [],
        error: "",
        time: 0
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
        builder.addCase(getDomainWatch.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getDomainWatch.rejected, (state, action) => {

        })
        // Create Organisation
        builder.addCase(getDomainWatch.fulfilled, (state, action) => {
            const payload = action.payload as any;
            state.loading = false;
            state.data = payload.data;
        })
    }
});

export const getDomainWatch = createAsyncThunk("DOMAINWATCH.Get", async (object: IDomainWatchRequest, { rejectWithValue }) => {
    try {
        const response = ky.post("http://skunkworks.dns.net.za:4004/domainWatch/list", {
            json: object, timeout: false, headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
            }
        }).json();
        return response;
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const { } = domainWatchSlice.actions;
export const domainWatchState = (state: AppState) => state.domainWatch;
export default domainWatchSlice.reducer;