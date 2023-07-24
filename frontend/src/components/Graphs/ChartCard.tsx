import { ChartBarIcon, FunnelIcon, MagnifyingGlassPlusIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { BarChart, BubbleChart, LineChart, PieChart, PolarAreaChart, RadarChart } from "@/components/Graphs";
import { useState, useEffect } from 'react';
import { ChartType, ChartTypeArray } from "@/Enums";
import { ChartCardButton } from "./ChartCardHeader";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import "animate.css";
import { useDispatch } from "react-redux";
import { setCurrentOpenState, setData } from "@/store/Slices/modalManagerSlice";
import { CheckboxFilter, DatePickerFilter, RadioboxFilter, ToggleFilter } from "./Filters";
import { Disclosure } from '@headlessui/react'
import { v4 as uuidv4 } from 'uuid';
import { SubmitButton } from "../Util";

interface IChartCard {
    title: string,
    data: any,
    defaultGraph: ChartType
}

export default function ChartCard({ title, data, defaultGraph }: IChartCard) {

    const dispatch = useDispatch();

    const [type, setType] = useState<ChartType>(defaultGraph);
    const [filterDropdown, setFilterDropdown] = useState<boolean>(false);

    const [request, setRequest] = useState<any>({});

    const addRequestObject = (key: string, value: any) => {
        if (!request[key]) {
            const temp = { ...request };
            temp[key] = value;
            console.log(generateDefaultValue(value.type));
            temp[key].value = generateDefaultValue(value.input);
            setRequest(temp);
        }
    }

    const generateDefaultValue = (type: string) => {
        switch (type) {
            case "togglebox": {
                return false;
            }
            case "string": {
                return "";
            }
            case "checkbox": {
                return [];
            }
            case "radiobox": {
                return "";
            }
        }
    }

    const updateRequestObject = (key: string, value: any) => {
        if (request[key]) {
            const temp = { ...request };
            temp[key].value = value;
            setRequest(temp);
        }
    }

    const removeRequestObject = (key: string) => {
        const temp = { ...request };
        delete temp[key];
        setRequest(temp);
    }

    const existsRequestObject = (key: string) => {
        const t = request[key];
        if (t) {
            return true;
        } else {
            return false;
        }
    }

    useEffect(() => {
        console.log(request);
    }, [request])

    const handleMagnifyModal = (value: boolean): void => {
        const modal: any = {
            type, data
        }
        dispatch(setCurrentOpenState("GRAPH.Modal"))
        dispatch(setData(modal));
    }

    const renderFilters = () => {
        const tempFilters = [
            {
                "name": "zone",
                "type": "string[]",
                "values": [
                    "CO.ZA",
                    "ORG.ZA",
                    "NET.ZA"
                ],
                "input": "checkbox"
            },
            {
                "name": "dateFrom",
                "type": "string",
                "input": "date-picker"
            },
            {
                "name": "dateTo",
                "type": "string",
                "input": "date-picker"
            },
            {
                "name": "transactions",
                "type": "string",
                "values": [
                    "create",
                    "grace",
                    "redeem",
                    "transfer",
                    "renew"
                ],
                "input": "checkbox"
            },
            {
                "name": "granularity",
                "type": "string",
                "values": [
                    "day",
                    "week",
                    "month",
                    "year"
                ],
                "input": "radiobox"
            }
        ]

        return tempFilters.map((element: any, index: number) => (
            <Disclosure key={index}>
                {({ open, close }) => (
                    <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75" onClick={() => {
                            addRequestObject(element.name, element);
                        }}>
                            <div className="flex gap-4 items-center">
                                {camelCaseRenderer(element.name)}
                            </div>
                            <ChevronDownIcon className={`w-6 h-6 ${open && "rotate-180"}`} />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                            {element.input === "checkbox" && <CheckboxFilter data={element} request={request[element.name]} update={updateRequestObject} />}
                            {element.input === "date-picker" && <DatePickerFilter data={element} request={request[element.name]} update={updateRequestObject} />}
                            {element.input === "radiobox" && <RadioboxFilter data={element} request={request[element.name]} update={updateRequestObject} camelCase={camelCaseRenderer} />}
                            {element.input === "togglebox" && <ToggleFilter data={element} request={request[element.name]} update={updateRequestObject} />}
                        </Disclosure.Panel>
                        <hr />
                    </>
                )}
            </Disclosure>
        ))
    }

    const filterSubmit = () => {
        const keys = Object.keys(request);

        const requestObject: any = {};

        keys.forEach((key, index) => {
            requestObject[key] = request[key].value;
        });

        console.log(requestObject);
    }

    const camelCaseRenderer = (value: string) => {
        return value.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
    }

    return (<>
        <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-primaryBackground dark:border-primaryBackground w-full animate__animated animate__fadeIn animate__slow">
            <div className="flex justify-between mb-5 text-black dark:text-white">
                <h1 className="p-1.5">{title}</h1>
                <div className="flex flex-row gap-1">
                    <div className="relative">
                        <div className="inline-flex justify-center p-1.5 text-black rounded cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-900 hover:bg-lightHover dark:hover:bg-gray-600" onClick={() => setFilterDropdown(!filterDropdown)}>
                            <FunnelIcon className="w-6 h-6" />
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                            appear={true}
                            show={filterDropdown}
                        >
                            <div className="absolute right-0 z-20 w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2 dark:bg-gray-700 max-h-72 overflow-y-scroll">
                                <h1 className="text-xl underline font-semibold">Filters</h1>
                                {renderFilters()}
                                <SubmitButton text="Get Results" className="mt-4 w-full" onClick={() => filterSubmit()} />
                            </div>
                        </Transition>

                    </div>
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