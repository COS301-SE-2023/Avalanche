import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";

export interface IUserState {
    username: string | null,
    email: string | null,
    firstName: string | null,
    lastName: string | null,
    profilePicture: string | null,
    userID: string | number | null
}

const initialState: IUserState = {
    username: null,
    email: null,
    firstName: null,
    lastName: null,
    profilePicture: null,
    userID: null
}

export const userSlice = createSlice({
    name: "user",
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
});

export const { } = userSlice.actions;
export const userState = (state: AppState) => state.user;
export default userSlice.reducer;