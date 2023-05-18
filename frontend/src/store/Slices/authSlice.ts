import { createSlice } from '@reduxjs/toolkit'
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";

interface IAuth {
    userID: string | number | null,
    token: string | null,
}

const initialState: IAuth = {
    userID: null,
    token: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
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
})

export const { } = authSlice.actions
export const authState = (state: AppState) => state.user;
export default authSlice.reducer