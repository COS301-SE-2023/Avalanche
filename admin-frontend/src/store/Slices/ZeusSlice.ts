import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { IDomainWatchRequest } from "@/interfaces/requests";
import { IDomainWatchResponse } from "@/interfaces/responses";
import { getCookie } from "cookies-next";
import { IFetchFiltersRequest } from "@/interfaces/requests/FetchFilterRequest";

export interface IFilterData {
    name:string,
    filter: {
        id: number,
        name: string,
        type: string,
        values: {} | null,
        input: string
    },
    opened: boolean
    selected:boolean
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
        {
            name:"N1",
            filter: {
                id: 1,
                name: "N1",
                type: "Beep",
                values: { v1: 1, v2: 2 },
                input: "chk"
            },
            opened: false,
            selected:false
        }, {
            name:"This-is-a-really-long-filter-name-to-prove-a-point",
            filter: {
                id: 1,
                name: "N2",
                type: "Beepbop",
                values: { v1: 2, v2: 4 },
                input: "chk"
            },
            opened: false,
            selected:false
        }, {
            name:"N3",
            filter: {
                id: 3,
                name: "N3",
                type: "Beepbopbip",
                values: { v1: 6, v2: 9 },
                input: "text"
            },
            opened: false,
            selected:false
        }

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
            const filterToUpdate = state.zeus.filters.find(filter => filter.name == name);
            if (filterToUpdate) {
                filterToUpdate.name=newData.name;
                filterToUpdate.filter = newData;
            }
        },
        updateDataSource(state, action) {
            state.zeus.fetchParams.dataSource = action.payload;
        },
        updateEndpoint(state, action) {
            state.zeus.fetchParams.endpoint = action.payload;
        },
        updateTypeOfUser(state, action) {
            state.zeus.fetchParams.typeOfUser = action.payload;
        }

    },
    extraReducers: (builder) => {
        builder.addCase(getFilters.pending, (state) => {

        })
        builder.addCase(getFilters.rejected, (state, action) => {

        })
        builder.addCase(getFilters.fulfilled, (state, action) => {
            const response = action.payload as any;
            let newArr: any[] = [];
            const filters = response.filters.filter((e: any) => {
                let copied = { ...e };
                const obj={name:copied.name,filter:copied,opened:false,selected:false};
                newArr.push(obj);

            })
            state.zeus.filters = newArr;
        })
    }
});

export const getFilters = createAsyncThunk("FILTERS.Get", async (object: IFetchFiltersRequest, { rejectWithValue }) => {
    try {
        const response = ky.post(`http://localhost:3998/getFilters`, {
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

export const { updateFilters, updateFilterData, updateDataSource, updateEndpoint, updateTypeOfUser } = zeusSlice.actions;
export const zeusState = (state: AppState) => state.zeus;
export default zeusSlice.reducer;