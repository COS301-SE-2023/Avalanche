import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { getCookie } from "cookies-next";

export interface IHeraData {
    dataSources: IDataSource[]
}

export interface IDataSource {
    dataSourceName: string,
    typesOfUsers: ITypeOfUser[] 
}
export interface ITypeOfUser {
    typeOfUser: string
    endpoints:string[]
}



export interface IHeraState {
    data: IHeraData,
    needToFetch: boolean
}

const initialState: IHeraState = {
    data:{dataSources:[]},
    needToFetch: false
}

export const heraSlice = createSlice({
    name: "hera",
    initialState: {
        hera: initialState,
    },


    reducers: {
        updateHeraData(state, action) {
            state.hera.data = action.payload;
        },
       
        updateNeedToFetch(state, action) {
            state.hera.needToFetch = action.payload;
        },
      
    },
    extraReducers: (builder) => {
        builder.addCase(getHera.pending, (state) => {

        })
        builder.addCase(getHera.rejected, (state, action) => {

        })
        builder.addCase(getHera.fulfilled, (state, action) => {
            const response = action.payload as any;
        
            // Create a new IHeraData object
            const heraData: IHeraData = {
                dataSources: [],
            };
        
            // Loop through the response data
            for (const item of response.data) {
                for (const dataSourceName in item) {
                    if (item.hasOwnProperty(dataSourceName)) {
                        const dataSource: IDataSource = {
                            dataSourceName,
                            typesOfUsers: [],
                        };
        
                        const typesOfUsersData = item[dataSourceName];
        
                        for (const typeOfUserObject of typesOfUsersData) {
                            for (const userType in typeOfUserObject) {
                                if (typeOfUserObject.hasOwnProperty(userType)) {
                                    const typeOfUser: ITypeOfUser = {
                                        typeOfUser: userType,
                                        endpoints: typeOfUserObject[userType],
                                    };
        
                                    dataSource.typesOfUsers.push(typeOfUser);
                                }
                            }
                        }
        
                        heraData.dataSources.push(dataSource);
                    }
                }
            }
            console.log("Hera data",heraData);
            // Update the state
            state.hera.data = heraData;
            
        })
    }
});



export const getHera = createAsyncThunk("HERA.Get", async (object: any, { rejectWithValue }) => {
    try {
        const response = ky.get(`http://${process.env.NEXT_PUBLIC_ZEUS ? process.env.NEXT_PUBLIC_ZEUS:"localhost"}:3998/getPersephone`, {
            timeout: false, headers: {
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


export const { updateNeedToFetch,updateHeraData} = heraSlice.actions;
export const heraState = (state: AppState) => state.hera;
export default heraSlice.reducer;