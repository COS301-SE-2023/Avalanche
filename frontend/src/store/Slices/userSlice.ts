import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { IOTPVerifyRequest, IRegisterRequest } from "@/interfaces/requests";
import { IOTPVerifyResponse, IRegisterResponse } from "@/interfaces/responses";

const url = "http://localho.st:4000/user-management"

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
            message: "",
            awaitingOTP: false,
            register: false,
            otp: false,
            error: ""
        }
    },
    reducers: {
        setAuth(state) {
            // set auth
        },
        getAuth(state) {

        },
        resetRequest(state) {
            state.requests = {
                loading: false,
                message: "",
                awaitingOTP: false,
                register: false,
                otp: false,
                error: "",
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action,
            };
        })
        // Register
        builder.addCase(register.fulfilled, (state, action) => {
            const payload = action.payload as IRegisterResponse;
            state.requests.loading = false;
            state.requests.message = payload.message;
            state.requests.awaitingOTP = true;
            state.requests.register = true;
        })
        builder.addCase(register.pending, (state) => {
            state.requests.loading = true; state.requests.error = "";
            state.requests.error = "";
            state.requests.message = "";
        })
        builder.addCase(register.rejected, (state, action) => {
            const payload = action.payload as IRegisterResponse;
            state.requests.loading = false;
            state.requests.register = true;
            state.requests.error = payload.message;
        })
        // OTP
        builder.addCase(otpVerify.fulfilled, (state, action) => {
            const payload = action.payload as IRegisterResponse;
            state.requests.otp = true;
            state.requests.message = payload.message;
        })
        builder.addCase(otpVerify.pending, (state) => {
            state.requests.loading = true;
            state.requests.error = "";
            state.requests.message = "";
        })
        builder.addCase(otpVerify.rejected, (state, action) => {
            const payload = action.payload as IRegisterResponse;
            state.requests.otp = true;
            state.requests.error = payload.message;
        })
    }
});

export const register = createAsyncThunk("AUTH.Register", async (object: IRegisterRequest, { rejectWithValue }) => {
    try {
        const response = await ky.post(`${url}/register`, {
            json: object
        }).json();
        return response as IRegisterResponse;
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message);
    }

});

export const otpVerify = createAsyncThunk("AUTH.OTPVerify", async (object: IOTPVerifyRequest, { rejectWithValue }) => {
    try {
        const response = await ky.post(`${url}/verify`, {
            json: object
        }).json();
        return response as IOTPVerifyResponse;
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})


export const { setAuth, getAuth, resetRequest } = userSlice.actions;
export const userState = (state: AppState) => state.user;
export default userSlice.reducer;