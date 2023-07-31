import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { IDomainWatchRequest } from "@/interfaces/requests";
import { IDomainWatchResponse } from "@/interfaces/responses";
import { getCookie } from "cookies-next";

export const domainWatchSlice = createSlice({
    name: "domainWatch",
    initialState: {
        loading: false,
        data: [],
        changingData: [],
        error: "",
        time: 0
    },
    reducers: {
        updateChanging(state, action) {
            state.changingData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action,
            };
        })
        // Get Domain Watch
        builder.addCase(getDomainWatch.pending, (state) => {
            state.loading = true;
            state.error = "";
            state.data = [];
            state.changingData = [];
            state.time = 0;
        })
        builder.addCase(getDomainWatch.rejected, (state, action) => {
            const payload = action.payload as any;
            state.loading = false;
            // state.error = payload.error;
        })
        builder.addCase(getDomainWatch.fulfilled, (state, action) => {
            const payload = action.payload as any;
            state.loading = false;
            state.data = payload.data;
            state.changingData = payload.data;
        })
    }
});

export const getDomainWatch = createAsyncThunk("DOMAINWATCH.Get", async (object: IDomainWatchRequest, { rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const response = ky.post(`${process.env.NEXT_PUBLIC_API}/domain-watch/list`, {
            json: object, timeout: false, headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const { updateChanging } = domainWatchSlice.actions;
export const domainWatchState = (state: AppState) => state.domainWatch;
export default domainWatchSlice.reducer;