import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { IDomainWatchRequest } from "@/interfaces/requests";
import { IDomainWatchResponse } from "@/interfaces/responses";
import { getCookie } from "cookies-next";
import { IFetchFiltersRequest } from "@/interfaces/requests/FetchFilterRequest";

export interface IFilterData {
    id:number,
    name: string,
    type: string,
    values: {}|null,
    input:string,
    opened: boolean
}

export interface IFetchParams {
    dataSource: string,
    endpoint: string,
    typeOfUser: string
}

export interface IZeusState {
    filters: IFilterData[],
    fetchParams: IFetchParams

}

const initialState: IZeusState = {
    filters: [
    ],
    fetchParams: {
        dataSource: "",
        endpoint: "",
        typeOfUser: ""
    }
}

export const zeusSlice = createSlice({
    name: "zeus",
    initialState: {
        zeus: initialState,
    },
    reducers: {
        updateFilters(state, action) {
            state.zeus.filters = action.payload;
        },
        updateFilterData(state, action) {
            const name = action.payload.name;
            const newData = action.payload.data;
            console.log("newData is", newData)
            const filterToUpdate = state.zeus.filters.find(filter => filter.name == name);
            if (filterToUpdate) {
                filterToUpdate.values = newData;
            }
        },
        updateDataSource(state,action){
            state.zeus.fetchParams.dataSource=action.payload;
        },
        updateEndpoint(state,action){
            state.zeus.fetchParams.endpoint=action.payload;
        },
        updateTypeOfUser(state,action){
            state.zeus.fetchParams.typeOfUser=action.payload;
        }

    },
    extraReducers: (builder) => {
        builder.addCase(getFilters.pending, (state) => {
            
        })
        builder.addCase(getFilters.rejected, (state, action) => {
            
        })
        builder.addCase(getFilters.fulfilled, (state, action) => {
            const response = action.payload as any;
            let newArr:any[]=[];
            const filters=response.filters.filter((e:any) => {
                let copied = { ...e };
                copied.opened=false;
                newArr.push(copied);
                
            })
            state.zeus.filters=newArr;
        })
    }
});

export const getFilters = createAsyncThunk("FILTERS.Get", async (object: IFetchFiltersRequest, { rejectWithValue }) => {
    try {
        const response = ky.post(`localhost:3998/getFilters`, {
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

export const { updateFilters, updateFilterData,updateDataSource,updateEndpoint,updateTypeOfUser } = zeusSlice.actions;
export const zeusState = (state: AppState) => state.zeus;
export default zeusSlice.reducer;