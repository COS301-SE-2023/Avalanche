import { configureStore, ThunkAction, Action, applyMiddleware, MiddlewareArray } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { modalManagerSlice } from "./modalManagerSlice";
import { createWrapper } from "next-redux-wrapper";

const makeStore = () =>
    configureStore({
        reducer: {
            [modalManagerSlice.name]: modalManagerSlice.reducer,
        },
        middleware: [logger] as const,
        devTools: true
    });


export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);