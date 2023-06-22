import { ChartBarIcon, FunnelIcon, MagnifyingGlassPlusIcon } from "@heroicons/react/24/solid";
import { BarChart, BubbleChart, LineChart, PieChart, PolarAreaChart, RadarChart } from "@/components/Graphs";
import { useState } from 'react';
import { ChartType, ChartTypeArray } from "@/Enums";
import { ChartCardButton } from "./ChartCardHeader";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import "animate.css";
import { useDispatch } from "react-redux";
import { setCurrentOpenState, setData } from "@/store/Slices/modalManagerSlice";

interface IChartCard {
    title: string,
    data: any,
    defaultGraph: ChartType
}

export default function ChartCard({ title, data, defaultGraph }: IChartCard) {

    const dispatch = useDispatch();

    const [type, setType] = useState<ChartType>(defaultGraph);
    const [magnifyModal, setMagnifyModal] = useState<boolean>(false);

    const handleMagnifyModal = (value: boolean): void => {
        const modal: any = {
            type, data
        }
        dispatch(setCurrentOpenState("GRAPH.Modal"))
        dispatch(setData(modal));
        // setMagnifyModal(value);
        // document.body.style.overflow = value ? "hidden" : "visible";
    }

    return (<>
        <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-primaryBackground dark:border-primaryBackground w-full animate__animated animate__fadeIn animate__slow">
            <div className="flex justify-between mb-5 text-black dark:text-white">
                <h1 className="p-1.5">{title}</h1>
                <div className="flex flex-row gap-1">
                    {/* <ChartCardButton onClick={(value: boolean) => setTypeDropdown(value)}>
                        <FunnelIcon className="w-6 h-6" />
                    </ChartCardButton>
                    */}
                    <ChartCardButton onClick={(value: boolean) => {
                        handleMagnifyModal(value);
                    }}>
                        <MagnifyingGlassPlusIcon className="w-6 h-6" />
                    </ChartCardButton>
                    {/* Change bar type */}
                    <Menu as="div" className="relative inline-block text-left -z-5">
                        <div>
                            <Menu.Button className="inline-flex justify-center p-1.5 text-black rounded cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-900 hover:bg-lightHover dark:hover:bg-gray-600">
                                <ChartBarIcon className="w-6 h-6" />
                            </Menu.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                                <div className="py-1">
                                    {
                                        ChartTypeArray.map((item, index) => {
                                            return (<Menu.Item key={index}>
                                                <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" key={index} onClick={() => {
                                                    setType(item.type);
                                                }}>{item.name} Chart</span>
                                            </Menu.Item>)
                                        })
                                    }
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>

                </div>
            </div>
            {type === ChartType.Bar && <BarChart data={data} />}
            {type === ChartType.Pie && <PieChart data={data} />}
            {type === ChartType.Line && <LineChart data={data} addClass="h-96" />}
            {type === ChartType.Bubble && <BubbleChart data={data} />}
            {type === ChartType.PolarArea && <PolarAreaChart data={data} />}
            {type === ChartType.Radar && <RadarChart data={data} />}
        </div >
    </>)
}