import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

/**
 * @interface ModalManagerState
 * @field {boolean} animateManager is a modal opening/closing animation helper
 * @field {string} currentOpen is what current modal is open
 */
export interface ModalManagerState {
    animateManager: boolean,
    currentOpen: string
}

/**
 * This is the initial state that ModalManagerState will be.
 */
const initialState: ModalManagerState = {
    animateManager: false,
    currentOpen: ""
}

// Creating the managing code to manage the modal manager
export const modalManagerSlice = createSlice({
    name: "modalManager",
    initialState,
    reducers: {
        // Set the animateManagers state
        setAnimateManagerState(state, action) {
            state.animateManager = action.payload
        },
        // Set the current open modal
        setCurrentOpenState(state, action) {
            state.currentOpen = action.payload
        },
        // Clear the current open modal
        clearCurrentOpenState(state) {
            state.currentOpen = "";
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

export const { setAnimateManagerState, setCurrentOpenState, clearCurrentOpenState } = modalManagerSlice.actions;

export const selectModalManagerState = (state: AppState) => state.modalManager;

export default modalManagerSlice.reducer;