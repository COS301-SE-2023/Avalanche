import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import ky from "ky";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "../store";

const url = `${process.env.NEXT_PUBLIC_API}`;

interface IPermissionState {
    permissions: IPermission[],
    endpointResolution: string
}

export interface IPermission {
    dataSource: string,
    tou: string,
    endpoints: string[],
}

const initialState: IPermissionState = {
    permissions: [],
    endpointResolution: "None"

}



export const permissionSlice = createSlice({
    name: "permission",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action,
            };
        })
        builder.addCase(getEndpoints.fulfilled, (state, action) => {
            const payload = action.payload as any;
            state.permissions = payload.data;
            state.endpointResolution = "Done";
        })
        builder.addCase(getEndpoints.pending, (state) => {
            state.endpointResolution = "Pending";
        })
        builder.addCase(getEndpoints.rejected, (state, action) => {
            // ErrorToast({text:"Could not fetch your permissions...\n Trying again"});
            state.endpointResolution = "Retry";
        })
    }
})

export const getEndpoints = createAsyncThunk("PERM.GetEndpoints", async (object, { rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const response = await ky.post(`${url}/user-management/getEndpoints`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response;
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

export const getDropdownData = createAsyncThunk("DROPDOWNDATA.Get", async (object, { rejectWithValue }) => {
    try {
        const response = ky.get(`${url}/getData`, {
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

export const permissionState = (state: AppState) => state.permission;
export default permissionSlice.reducer;