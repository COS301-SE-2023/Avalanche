import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky from "ky";
import { ILoginRequest, IOTPVerifyRequest, IRegisterRequest } from "@/interfaces/requests";
import { IOTPVerifyResponse, IRegisterResponse, ILoginResponse } from "@/interfaces/responses";
import { setCookie } from 'cookies-next';
import { ISettings, IOrganisation, IDataProduct, IUserGroups } from "@/interfaces/interfaces";

const url = "http://localho.st:4000/user-management"

export interface IUserState {
    id: string | null,
    email: string | null,
    firstName: string | null,
    lastName: string | null
    settings: ISettings | null,
    profilePicture: string | null,
    // favourites: IDashBoard[] | null,
    dataProducts: IDataProduct[] | null,
    organisation: IOrganisation | null,
    userGroups: IUserGroups[] | null,
    token?: string | null
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
    id: null,
    email: null,
    firstName: null,
    lastName: null,
    settings: null,
    profilePicture: null,
    dataProducts: null,
    organisation: null,
    userGroups: null
}

export const userSlice = createSlice({
    name: "user",
    initialState: {
        authed: false,
        user: initialState,
        requests: {
            loading: false,
            message: "",
            awaitingOTP: false,
            register: false,
            otp: false,
            error: ""
        },
        login: {
            success: false,
            error: false,
            message: ""
        },
        loading: false
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
        // Login
        builder.addCase(login.fulfilled, (state, action) => {
            const payload = action.payload as ILoginResponse;
            let d = new Date();
            d.setTime(d.getTime() + (1440 * 60 * 1000));
            setCookie('jwt', payload.userWithToken.token, { expires: d });

            const userObj: IUserState = { ...payload.userWithToken };
            delete userObj.token;
            state.user = userObj;
            state.loading = false;
            state.login.success = true;

            state.authed = true;

        })
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(login.rejected, (state, action) => {

        })
    }
});

/**
 * This action handles calling the register api call
 */
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

/**
 * This action handles calling the otp api call
 */
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

/**
 * This action handles calling the login api call
 */
export const login = createAsyncThunk("AUTH.Login", async (object: ILoginRequest, { rejectWithValue }) => {
    try {
        const response = await ky.post(`${url}/login`, {
            json: object
        }).json();
        return response;
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})


export const { setAuth, getAuth, resetRequest } = userSlice.actions;
export const userState = (state: AppState) => state.user;
export default userSlice.reducer;