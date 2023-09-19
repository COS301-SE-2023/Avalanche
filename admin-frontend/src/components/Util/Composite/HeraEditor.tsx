import { Tabs } from "flowbite";
import { useEffect, useState } from "react";
import type { TabsOptions, TabsInterface, TabItem } from "flowbite";
import { useDispatch, useSelector } from "react-redux";
import { zeusState, IZeusState, updateFilters, IFilterData } from "@/store/Slices/ZeusSlice";
import ZeusTab from "./ZeusTab";
import { heraState } from "@/store/Slices/HeraSlice";
import HeraTab from "./HeraTab";

export default function HeraEditor() {

    const stateHera = useSelector(heraState);
    //const [data,setData]=useState<any>({});

    const dispatch = useDispatch();
    let tabs: TabsInterface;

    /*
    * tabElements: array of tab objects
    * options: optional
    */

    useEffect(() => {
        console.log("changed")
    }, [stateHera.hera.data]);

    function makeHeraTab(heraData:any){
        if(heraData.dataSources && heraData.dataSources.length>0){
            return <><HeraTab permissionData={heraData}></HeraTab></>
        }
    }


    return <>
        <div className="mr-5 mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul className=" flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400" id="tabExample" role="tablist">
            <li key={0} className={"inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500"} role="presentation">
                    <button className="pr-1" >Permissions</button>
                </li>
            </ul>
        </div>
        <div className="pr-5" id="tabContentExample">
        <div className={' p-4 rounded-lg bg-gray-50 dark:bg-primaryBackground overflow-x-hidden overflow-y-scoll max-h-[calc(100vh-11rem)]'} role="tabpanel">
                    {makeHeraTab(stateHera.hera.data)}
                </div>
        </div>
    </>
}