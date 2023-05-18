import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";

export interface IUserState {
    userID: string | null,
    userData: IUser,
    userAuth: IAuth
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
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuth(state) {
            // set auth
        },
        getAuth(state) {

        },
        updateProfilePicture(state, action) {
            // update profile picture
        },
        login(state, action) {
            // handle login
            const { email, password } = action.payload;
        },
        register(state, action) {
            // handle register
            const { email, confirmEmail, password, confirmPassword, firstName, lastName, country } = action.payload;
        },
        verifyOTP(state, action) {
            const { email, token, otp } = action.payload;
        }
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

export const { setAuth, getAuth, updateProfilePicture, login, register, verifyOTP } = userSlice.actions;
export const userState = (state: AppState) => state.user;
export default userSlice.reducer;