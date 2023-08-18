import { Tabs } from "flowbite";
import { useEffect, useState } from "react";
import type { TabsOptions, TabsInterface, TabItem } from "flowbite";
import { useDispatch, useSelector } from "react-redux";
import { zeusState, IZeusState, updateFilters, IFilterData } from "@/store/Slices/ZeusSlice";
import ZeusTab from "./ZeusTab";

export default function ZeusEditor() {

    const stateZeus = useSelector(zeusState);

    const dispatch = useDispatch();
    let tabs: TabsInterface;

    /*
    * tabElements: array of tab objects
    * options: optional
    */


    const closeTab = (name: string) => {
        let newArr:IFilterData[]=[];
        stateZeus.zeus.filters.filter((e:IFilterData) => {
            let copied = { ...e };
            if (copied.name == name) { copied.opened = false; }       
            newArr.push(copied);
        })
        dispatch(updateFilters(newArr));
    }

    const selectTab = (name: string) => {
        let newArr: IFilterData[] = [];
        stateZeus.zeus.filters.filter((e: IFilterData) => {
            let copied = { ...e };
            if (copied.name == name) {
                copied.selected=true;
            }
            else {
               copied.selected=false;
            }
            newArr.push(copied);
        })

        dispatch(updateFilters(newArr));
    }



    const makeTabs = () => {
        return stateZeus.zeus.filters.map((item: IFilterData, index: number) => {

            if (item.opened) {
                return <li className={item.selected ? "inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500":" inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300"} role="presentation">
                    <button onClick={() => selectTab(item.name.replaceAll(" ", "-"))} className="pr-1" >{item.name.replaceAll("-", " ")}</button>
                    <button onClick={() => closeTab(item.name.replaceAll(" ", "-"))} type="button" className="text-white hover:bg-blue-800 focus:ring-3 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center  dark:hover:bg-thirdBackground dark:focus:ring-blue-800">
                        <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M 1 1 L 9 9 M 1 9 L 9 1" />
                        </svg>
                    </button>
                </li>
            } else return null
        })
    }



    const makeTabContent = () => {
        return stateZeus.zeus.filters.map((item: IFilterData, index: number) => {
            if (item.opened) {
                return <div className={item.selected ? 'p-4 rounded-lg bg-gray-50 dark:bg-primaryBackground overflow-x-scroll overflow-y-scoll max-h-[calc(100vh-11rem)]':'hidden p-4 rounded-lg bg-gray-50 dark:bg-primaryBackground overflow-x-scroll overflow-y-scoll max-h-[calc(100vh-11rem)]'} id={item.name.replaceAll(" ", "-") + ""} role="tabpanel">
                    <ZeusTab filterData={item}></ZeusTab> 
                </div>
            } else return null;
        })

    }

    return <>
        <div className="mr-5 mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul className=" flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400" id="tabExample" role="tablist">
                {makeTabs()}
            </ul>
        </div>
        <div className="pr-5" id="tabContentExample">
            {makeTabContent()}
        </div>
    </>
}