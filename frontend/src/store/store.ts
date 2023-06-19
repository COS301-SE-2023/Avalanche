import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import { modalManagerSlice } from "./Slices/modalManagerSlice";
import { userSlice } from "./Slices/userSlice";
import { createWrapper } from "next-redux-wrapper";
import thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

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
    [userSlice.name]: userSlice.reducer
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