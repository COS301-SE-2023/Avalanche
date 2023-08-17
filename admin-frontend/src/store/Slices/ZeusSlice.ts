import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { IDomainWatchRequest } from "@/interfaces/requests";
import { IDomainWatchResponse } from "@/interfaces/responses";
import { getCookie } from "cookies-next";

export interface IFilterData {
    data: {}
    name: string
    opened: boolean
}

export interface IZeusState {
    filters: IFilterData[],
}

const initialState: IZeusState = {
    filters: [{
        data: {data:"d"},
        name: "Name_1",
        opened: false
    }, {
        data: {maap:"map"},
        name: "Name_2",
        opened: false
    }, {
        data: {hello:"hello"},
        name: "Name_3",
        opened: false
    }
    ],
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
            console.log("newData is",newData)
            const filterToUpdate = state.zeus.filters.find(filter => filter.name == name);
            if (filterToUpdate) {
              filterToUpdate.data = newData;
            }
          },
        
    },
    extraReducers: (builder) => {

    }
});

export const { updateFilters,updateFilterData } = zeusSlice.actions;
export const zeusState = (state: AppState) => state.zeus;
export default zeusSlice.reducer;