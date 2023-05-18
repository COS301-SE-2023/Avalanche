import { configureStore, ThunkAction, Action, applyMiddleware, MiddlewareArray, combineReducers } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { modalManagerSlice } from "./modalManagerSlice";
import { createWrapper } from "next-redux-wrapper";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
    [modalManagerSlice.name]: modalManagerSlice.reducer,
});

const makeConfiguredStore = () =>
    configureStore({
        reducer: rootReducer,
        middleware: [logger] as const,
        devTools: true
    });

export const makeStore = () => {
    const isServer = typeof window === "undefined";
    if (isServer) {
        return makeConfiguredStore();
    } else {
        const persistConfig = {
            key: "nextjs",
            whitelist: ["modalManager"],
            storage
        };
        const persistedReducer = persistReducer(persistConfig, rootReducer);
        let store: any = configureStore({
            reducer: persistedReducer,
            devTools: true,
            middleware: [logger] as const,
        });
        store.__persistor = persistStore(store);
        return store;
    }
}


export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);