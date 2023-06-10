import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";

import { apiConn } from "@/api/server";

const registerMethod = createAsyncThunk("AUTH.Register", async (userId, thunkApi) => {

});

export interface IUserState {
    userID: string | null,
    userData: IUser,
    userAuth: IAuth,
    organization: object[] | null,
    dataProducts: object | null
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
    dataProducts: null
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
            const { email, confirmEmail, password, confirmPassword, firstName, lastName, country } = action.payload;
            if (email !== confirmEmail) {

            }

            if (password !== confirmPassword) {

            }
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

// const fetchUsers = () => async(dispatch) => {
//     dispatch
// }
