import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { IRegisterRequest } from "@/interfaces/requests";
import { IRegisterResponse } from "@/interfaces/responses";

export interface IUserState {
    userID: string | null,
    userData: IUser,
    userAuth: IAuth,
    organization: object[] | null,
    dataProducts: object | null,
}

export interface IUser {
    username: string | null,
    email: string | null,
    firstName: string | null,
    lastName: string | null,
    profilePicture: string | null,
}

export interface IAuth {
    token: string | null,
}

const initialState: IUserState = {
    userID: null,
    userData: {
        username: null,
        email: null,
        firstName: null,
        lastName: null,
        profilePicture: null,
        userID: null
    } as IUser,
    userAuth: {
        token: null
    } as IAuth,
    organization: null,
    dataProducts: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: initialState,
        requests: {
            loading: false,
            success: "",
            error: "",
            awaitingOTP: false
        }
    },
    reducers: {
        setAuth(state) {
            // set auth
        },
        getAuth(state) {

        },
        setLoading(state, action) {
            state.requests.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action,
            };
        })
        builder.addCase(register.fulfilled, (state, action) => {
            console.log("wow");
            const payload = action.payload as IRegisterResponse;
            state.requests.loading = false;
            state.requests.success = payload.message;
            state.requests.awaitingOTP = true;
        })
        builder.addCase(register.pending, (state) => {
            state.requests.loading = true;
        })
        builder.addCase(register.rejected, (state, { payload }) => {

        })
    }
});

export const register = createAsyncThunk("AUTH.Register", async (object: IRegisterRequest) => {
    const response = await ky.post(`http://localho.st:4000/user-management/register`, {
        json: object
    }).json();
    console.log("returning");
    return response as IRegisterResponse;
});


export const { setAuth, getAuth, setLoading } = userSlice.actions;
export const userState = (state: AppState) => state.user;
export default userSlice.reducer;