import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
import ky, { HTTPError } from "ky";
import { ILoginRequest, IOTPVerifyRequest, IRegisterRequest, ICreateOrganisationRequest, ICreateUserGroupRequest } from "@/interfaces/requests";
import { IOTPVerifyResponse, IRegisterResponse, ILoginResponse, ICreateOrgnisationResponse, ICreateUserGroupResponse } from "@/interfaces/responses";
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { ISettings, IOrganisation, IDataProduct, IUserGroups } from "@/interfaces/interfaces";

const url = `${process.env.NEXT_PUBLIC_API}/user-management`;

export interface IUserState {
    [x: string]: any;
    id: string | null,
    email: string | null,
    firstName: string | null,
    lastName: string | null
    settings: ISettings | null,
    profilePicture: string | null,
    dataProducts: IDataProduct[] | null,
    organisation: IOrganisation | null,
    userGroups: IUserGroups[] | null,
    token?: string | null,
    dashboards?: any[] | null,
}

export interface IUser {
    id: string | null,
    email: string | null,
    firstName: string | null,
    lastName: string | null
    settings: ISettings | null,
    profilePicture: string | null,
    dataProducts: IDataProduct[] | null,
    organisation: IOrganisation | null,
    userGroups: IUserGroups[] | null,
    token?: string | null,
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
    userGroups: null,
    dashboards: null
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
        },
        login: {
            success: false,
            error: false,
            message: ""
        },
        loading: false,
        createGroupSuccess: false,
        addUserGroupSuccess: false,
        removeUserGroupSuccess: false,
        error: "",
        userGroups: [],
        api: false,
    },
    reducers: {
        setAuth(state) {
            // set auth
        },
        getAuth(state) {

        },
        setCreateGroupSuccess(state, action) {
            state.createGroupSuccess = action.payload;
        },
        setAddUserGroupSuccess(state, action) {
            state.addUserGroupSuccess = action.payload;
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
        },
        logout(state) {
            deleteCookie("jwt");
            localStorage.removeItem("persist:nextjs");
            state.user = initialState;
        },
        clearError(state) {
            state.error = "";
            state.requests.error = "";
            state.login.error = false;
            state.login.message = "";
        },
        updateDashboards(state, action) {
            state.user.dashboards = action.payload;
        },
        updateAPI(state, action) {
            state.api = action.payload;
            state.user.checkApi = action.payload;
        },
        clearLoading(state) {
            state.requests.loading = false;
            state.loading = false;
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
        })
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.requests.error = action.payload as any;
        })
        // Create Organisation
        builder.addCase(createOrganisation.fulfilled, (state, action) => {
            const payload = action.payload as ICreateOrgnisationResponse;
            state.user.organisation = payload.message.organisation;
            state.user.userGroups = payload.message.userGroups;
            state.loading = false;
        })
        builder.addCase(createOrganisation.pending, (state) => {
            state.loading = true;

        })
        builder.addCase(createOrganisation.rejected, (state, action) => {
            state.loading = false;
        })
        // Create User Group
        builder.addCase(createOrganisationGroup.fulfilled, (state, action) => {
            const payload = action.payload as ICreateUserGroupResponse;
            state.user.userGroups?.push(payload.message);
            state.createGroupSuccess = true;
            // state.user.organisation = payload.message.organisation;
        })
        builder.addCase(createOrganisationGroup.pending, (state) => {
            state.createGroupSuccess = false;
        })
        builder.addCase(createOrganisationGroup.rejected, (state, action) => {
            state.createGroupSuccess = false;
        })
        // Get User Group
        builder.addCase(getUserGroups.fulfilled, (state, action) => {
            const payload = action.payload as any;
            state.userGroups = payload.users;
            state.loading = false;
        })
        builder.addCase(getUserGroups.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getUserGroups.rejected, (state, action) => {
            state.loading = false;
        })
        // Add User
        builder.addCase(addUserToGroup.fulfilled, (state, action) => {
            state.addUserGroupSuccess = true;
            state.loading = false;
        })
        builder.addCase(addUserToGroup.pending, (state) => {
            state.loading = true;
            state.addUserGroupSuccess = false;
        })
        builder.addCase(addUserToGroup.rejected, (state, action) => {
            state.addUserGroupSuccess = false;
            state.loading = false;
            state.requests.error = action.payload as string;
        })
        // Remove User
        builder.addCase(removeUserFromGroup.fulfilled, (state, action) => {
            state.removeUserGroupSuccess = true;
            state.requests.error = "";
            state.loading = false;
            // remove the user from the userGroups
            const payload = action.payload as any;
            const response = payload.response;
            const data = payload.data;
        })
        builder.addCase(removeUserFromGroup.pending, (state) => {
            state.loading = true;
            state.removeUserGroupSuccess = false;
            state.requests.error = "";
        })
        builder.addCase(removeUserFromGroup.rejected, (state, action) => {
            state.removeUserGroupSuccess = false;
            state.loading = false;
            state.requests.error = action.payload as string;
        })
        // Get Latest Org
        builder.addCase(getLatestOrganisation.fulfilled, (state, action) => {
            const payload = action.payload as any;
            state.user.organisation = payload.organisation;
            state.user.userGroups = payload.userGroups;
            state.loading = false;
        })
        builder.addCase(getLatestOrganisation.rejected, (state, action) => {
            state.loading = false;
        })
        builder.addCase(getLatestOrganisation.pending, (state) => {
            state.loading = true;
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
        }).json() as any;

        if (!response) {
            console.log("asdasdd");
            return rejectWithValue("There was an issue. We don't know what happened, and we sure you don't either. So just try again ^_^.");
        }

        return response;
    } catch (e) {
        let error = e as HTTPError;
        if (error.name === 'HTTPError') {
            const newError = await error.response.json();
            return rejectWithValue(newError.message);
        }
    }
})

/**
 * This action handles the calling of the create organisation 
 */
export const createOrganisation = createAsyncThunk("ORG.CreateOrganisation", async (object: ICreateOrganisationRequest, { rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const response = await ky.post(`${url}/createOrganisation`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response as ICreateOrgnisationResponse;
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

/**
 * This action handles the creation of an organisation group
 */
export const createOrganisationGroup = createAsyncThunk("ORG.CreateOrganisationGroup", async (object: ICreateUserGroupRequest, { rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const response = await ky.post(`${url}/createUserGroup`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response as ICreateUserGroupResponse;
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

/**
 * This actions gets the latest user groups
 */
export const getUserGroups = createAsyncThunk("ORG.GetUserGroups", async (object: any, { rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const response = await ky.post(`${url}/getMembers`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response as any;
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message);
    }
})

/**
 * This action handles adding a user to the group
 */
export const addUserToGroup = createAsyncThunk("ORG.AddUserToGroup", async (object: any, { rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const response = await ky.post(`${url}/addUserToUserGroup`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response as any;
    } catch (e) {
        let error = e as HTTPError;
        if (error.name === 'HTTPError') {
            const newError = await error.response.json();
            return rejectWithValue(newError.message);
        }
    }
})

/**
 * This action removes a user from a user group
 */
export const removeUserFromGroup = createAsyncThunk("ORG.RemoveUserFromGroup", async (object: any, { rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const response = await ky.post(`${url}/removeUserFromUserGroup`, {
            json: object,
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return { data: response, request: object } as any;
    } catch (e) {
        let error = e as HTTPError;
        if (error.name === 'HTTPError') {
            const newError = await error.response.json();
            return rejectWithValue(newError.message);
        }
    }
})

/**
 * This action gets the latest organistaion
 */
export const getLatestOrganisation = createAsyncThunk("ORG.GetLatestOrganisation", async (object: any, { rejectWithValue }) => {
    try {
        const jwt = getCookie("jwt");
        const response: any = await ky.post(`${url}/getUserInfo`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).json();
        return response.message as any;
    } catch (e) {
        let error = e as HTTPError;
        if (error.name === 'HTTPError') {
            const newError = await error.response.json();
            return rejectWithValue(newError.message);
        }
    }
})

export const { setAuth, getAuth, resetRequest, logout, setCreateGroupSuccess, setAddUserGroupSuccess, clearError, updateDashboards, updateAPI, clearLoading } = userSlice.actions;
export const userState = (state: AppState) => state.user;
export default userSlice.reducer;
