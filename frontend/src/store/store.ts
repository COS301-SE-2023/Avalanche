import { Action, ThunkAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import thunk from "redux-thunk";
import { domainWatchSlice } from "./Slices/domainWatchSlice";
import { graphSlice } from "./Slices/graphSlice";
import { modalManagerSlice } from "./Slices/modalManagerSlice";
import { permissionSlice } from "./Slices/permissionSlice";
import { qbeeSlice } from "./Slices/qbeeSlice";
import { settingsSlice } from "./Slices/settingsSlice";
import { userSlice } from "./Slices/userSlice";

const createNoopStorage = () => {
    return {
        getItem(_key: any) {
            return Promise.resolve(null);
        },
        setItem(_key: any, value: any) {
            return Promise.resolve(value);
        },
        removeItem(_key: any) {
            return Promise.resolve();
        },
    };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const rootReducer = combineReducers({
    [modalManagerSlice.name]: modalManagerSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
    [domainWatchSlice.name]: domainWatchSlice.reducer,
    [graphSlice.name]: graphSlice.reducer,
    [permissionSlice.name]: permissionSlice.reducer,
    [qbeeSlice.name]: qbeeSlice.reducer,
});

const makeConfiguredStore = () =>
    configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false,
            ignoreActions: true
        }).concat(thunk),
        devTools: true
    });

export const makeStore = () => {
    const isServer = typeof window === "undefined";
    if (isServer) {
        return makeConfiguredStore();
    } else {
        const persistConfig = {
            key: "nextjs",
            whitelist: ["modalManager", "user"],
            storage
        };
        const persistedReducer = persistReducer(persistConfig, rootReducer);
        let store: any = configureStore({
            reducer: persistedReducer,
            devTools: true,
            middleware: (getDefaultMiddleware) => getDefaultMiddleware({
                serializableCheck: false,
                ignoreActions: true
            }).concat(thunk),
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