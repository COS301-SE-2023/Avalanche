// @ts-ignore
import {
    JsonTree,
    ADD_DELTA_TYPE,
    REMOVE_DELTA_TYPE,
    UPDATE_DELTA_TYPE,
    DATA_TYPES,
    INPUT_USAGE_TYPES,
} from 'react-editable-json-tree';

import { Transition } from '@headlessui/react'

import { useEffect, useState, useRef } from "react";
import SubmitButton from '../SubmitButton';
import { useDispatch, useSelector } from "react-redux";
import { zeusState, updateFilters, IFilterData, updateFilterData } from '@/store/Slices/ZeusSlice';
import SuccessToast from '../SuccessToast';
import ErrorToast from '../ErrorToast';
import ky, { HTTPError } from "ky"
import ISaveFilters from '@/interfaces/requests/SaveFilters';

import { selectModalManagerState, setCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { heraState } from '@/store/Slices/HeraSlice';

// interface ITransferFilterData {
//     permissionData: any
// }

// interface IMenuButton {
//     buttonName: string,
//     func: any,
//     svg: string
// }



export default function HeraTab({ permissionData }) {

    const stateHera = useSelector(heraState);
    let [menuExpanded, setMenuExpanded] = useState(false);
    const dispatch = useDispatch();
    const [undoStack, setUndoStack] = useState([JSON.parse(JSON.stringify(permissionData))]);
    const undoStackRef = useRef(undoStack);

    useEffect(() => {
        console.log(undoStack);
    }, [undoStack]);








    const updateDashboard = async () => {
 
        console.log("making data")
        const updateData = {
           
        };
        try {

            console.log("send req")
            const res = await ky.post(`http://${process.env.NEXT_PUBLIC_ZEUS ? process.env.NEXT_PUBLIC_ZEUS:"localhost"}:3998/editFilter`, {
                json: updateData, timeout: false, headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
                }
            }).json();
            console.log("done")
            console.log(res);
            return SuccessToast({ text: `Successfully updated ${name}` })
        } catch (e) {
            let error = e;
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                return ErrorToast({ text: "iProblem" });
            }
        }

    }

  

    useEffect(() => {
        console.log('Updated undoStack:', undoStack);
        undoStackRef.current = undoStack; // Update the ref with the latest undoStack value
    }, [undoStack]);


   



    function toggleCheck() {
        setMenuExpanded(prevCheck => !prevCheck);
    }


    const [menuButtons, setMenuButtons] = useState([
        {
            buttonName: "save",
            func: updateDashboard,
            svg: "M4 3h13l3.707 3.707a1 1 0 0 1 .293.707V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm8 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 5v4h10V5H5z"
        },
    ]);
    const makeMenuButtons = () => {
        let num = (((menuButtons.length) * 4));
        return menuButtons.map((item, index) => {
            
            
            console.log(num);
            const openStyle = `flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg  dark:hover:text-white dark:text-gray-400 dark:bg-secondaryBackground dark:hover:bg-thirdBackground focus:ring-2 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400`;
            
            return <><Transition
                show={menuExpanded}
                enter="transition duration-300 transform opacity transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);"
                enterFrom={`translate-x-[15rem] opacity-0`}
                enterTo="translate-x-0 opacity-100"
                leave="transition duration-300 transform"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo={`translate-x-[15rem] opacity-0`}
            >
                <button onClick={item.func} type="button" data-tooltip-target="tooltip-share" data-tooltip-placement="left"
                    className=
                    {openStyle}>
                    <svg className="w-8 h-8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d={item.svg} />
                    </svg>
                    <span className="sr-only">item.buttonName</span>
                </button>
            </Transition>

                <div id="tooltip-share" role="tooltip" className="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                    Share
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div></>
        })
    }

    return <>
        <div>
            <div data-dial-init className="relative inset-0 ml-[50%] flex flex-row-reverse m z-10 group">
                <button onClick={toggleCheck} type="button" data-dial-toggle="speed-dial-menu-square-click" aria-controls="speed-dial-menu-square" aria-expanded="false" className="z-20 flex items-center justify-center text-white bg-blue-700 rounded-lg w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-300">
                    <svg className={menuExpanded ? " w-7 h-7 transition-transform rotate-45" : "w-7 h-7 transition-transform rotate-0"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 17">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M 10.0166 3.4627 l 2.3834 -2.2627 L 16.239 5.1598 L 13.9763 7.4225 M 10.0166 3.4627 L 2.3313 11.148 C 2.1812 11.298 2.097 11.5015 2.097 11.7137 V 15.3421 H 5.7254 C 5.9375 15.3421 6.141 15.2578 6.291 15.1078 L 13.9763 7.4225 M 10.0166 3.4627 l 3.9598 3.9598" />
                    </svg>
                    <span className="sr-only">Open actions menu</span>
                </button>
                <div id="speed-dial-menu-square" className={menuExpanded ? "flex items-center mr-4 space-x-2" : "flex items-center mr-4 space-x-2"}>

                    {makeMenuButtons()}
                </div>

            </div>
            <div className="relative left bottom-10  z-0">
                <JsonTree readOnly={false} rootName="Permissions" data={stateHera.hera.data} onFullyUpdate={()=>{}}></JsonTree>
            </div>

        </div>

    </>
}