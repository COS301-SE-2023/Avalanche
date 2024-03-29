import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "../store";

/**
 * @interface ModalManagerState
 * @field {boolean} animateManager is a modal opening/closing animation helper
 * @field {string} currentOpen is what current modal is open
 */
export interface IModalManagerState {
    animateManager: boolean,
    currentOpen: string,
    data: any,
    graphName: string,
    zoomedData: { graphName: string, dashboardID: string }
}

/**
 * This is the initial state that ModalManagerState will be.
 */
const initialState: IModalManagerState = {
    animateManager: false,
    currentOpen: "",
    data: null,
    graphName: "",
    zoomedData: { graphName: "", dashboardID: "" }
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
            state.zoomedData = { graphName: "", dashboardID: "" };
            state.graphName = "";
        },
        // Set data
        setData(state, action) {
            state.data = { data: action.payload.data, type: action.payload.type };
            state.graphName = action.payload.graphName;
        },
        // Zoomed Data
        setZoomData(state, action) {
            if (state.zoomedData !== null && state.zoomedData !== undefined) {
                state.zoomedData.graphName = action.payload?.graphName;
                state.zoomedData.dashboardID = action.payload?.dashboardID;
            }
        },
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

export const { setAnimateManagerState, setCurrentOpenState, clearCurrentOpenState, setData, setZoomData } = modalManagerSlice.actions;

export const selectModalManagerState = (state: AppState) => state.modalManager;

export default modalManagerSlice.reducer;