import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";

/**
 * @interface ModalManagerState
 * @field {boolean} animateManager is a modal opening/closing animation helper
 * @field {string} currentOpen is what current modal is open
 */
export interface IModalManagerState {
    animateManager: boolean,
    currentOpen: string,
    data: any,
    zoomedData: any
}

/**
 * This is the initial state that ModalManagerState will be.
 */
const initialState: IModalManagerState = {
    animateManager: false,
    currentOpen: "",
    data: null,
    zoomedData: null
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
            state.data = null;
        },
        // Set data
        setData(state, action) {
            state.data = action.payload;
        },
        // Zoomed Data
        setZoomData(state, action) {
            state.zoomedData.graphName = action.payload.graphName;
            state.zoomedData.dashboardID = action.payload.dashboardID;
        },
        // Clear Zoomed Data
        clearZoomData(state) {
            // state.zoomedData = {};
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

export const { setAnimateManagerState, setCurrentOpenState, clearCurrentOpenState, setData, setZoomData, clearZoomData } = modalManagerSlice.actions;

export const selectModalManagerState = (state: AppState) => state.modalManager;

export default modalManagerSlice.reducer;