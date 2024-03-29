import { ChartType, ChartTypeArray } from "@/Enums";
import { BarChart, BubbleChart, LineChart, PieChart, PolarAreaChart, RadarChart, TableChart } from "@/components/Graphs";
import { getFilters, graphState } from "@/store/Slices/graphSlice";
import { clearCurrentOpenState, setCurrentOpenState, setData, setZoomData } from "@/store/Slices/modalManagerSlice";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ArrowDownTrayIcon, ChartBarIcon, ChevronDownIcon, FunnelIcon, MagnifyingGlassPlusIcon } from "@heroicons/react/24/solid";
import "animate.css";
import { getCookie } from "cookies-next";
import ky, { HTTPError } from "ky";
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ChartCardError, ErrorToast, SubmitButton } from "../Util";
import { ChartCardButton } from "./ChartCardHeader";
import { CheckboxFilter, DatePickerFilter, NestedCheckbox, RadioboxFilter, ToggleFilter } from "./Filters";

interface IChartCard {
    title: string,
    data: any,
    defaultGraph: ChartType,
    state: any,
    id?: string,
    updateGraph?: any
}

export default function CustomChartCard({ title, data, defaultGraph, state, id, updateGraph }: IChartCard) {
    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const filters = stateGraph.filters;

    useEffect(() => {
        dispatch(clearCurrentOpenState)
        if (filters.length === 0) dispatch(getFilters({}));
    }, [])
    const [type, setType] = useState<ChartType>(defaultGraph);
    const [filterDropdown, setFilterDropdown] = useState<boolean>(false);
    const [graphData, setGraphData] = useState<any>({});
    const [warehouse, setWarehouse] = useState<string>("");
    const [gType, setGType] = useState<string>("");

    const [request, setRequest] = useState<any>({});

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const addRequestObject = (key: string, value: any) => {
        if (!request[key]) {
            const temp = { ...request };
            let object = { ...value };
            object.value = generateDefaultValue(value.input);
            temp[key] = object;
            setRequest(temp);
        }
    }

    const updateRequestObject = (key: string, value: any) => {
        if (request[key]) {
            const temp = { ...request };
            temp[key].value = value;
            setRequest(temp);
        }
    }


    const renderFilters = () => {

        return filterGraphs()?.filters?.map((element: any, index: number) => (
            <Disclosure key={index}>
                {({ open, close }) => (
                    <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75" onClick={() => {
                            if (element.input === "nestedCheckbox") {
                                addRequestObject("transactions", element)
                            } else {
                                addRequestObject(element.name, element);
                            }
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
                            {element.input === "nestedCheckbox" && <NestedCheckbox data={element} request={request["transactions"]} update={updateRequestObject} />}
                        </Disclosure.Panel>
                        <hr />
                    </>
                )}
            </Disclosure>
        ))
    }

    useEffect(() => {
        fetchGraphData({})
    }, [])

    useEffect(() => {
        fetchGraphData({})
    }, [id])

    const fetchGraphData = async (filters: any) => {
        setLoading(true);
        if (data.endpointName) {
            const d = data.endpointName.split("/");
            setWarehouse(d[0]);
            d.splice(0, 1)
            setGType(d.join('/'));

        } else {
            setWarehouse(data.warehouse);
            setGType(data.type);
        }
        try {
            if (Object.keys(filters).length === 0 && filters.constructor === Object) {
                filters = data.filters
            }
            const jwt = getCookie("jwt");
            const url = data.endpointName ? `${process.env.NEXT_PUBLIC_API}/${data.endpointName}` : `${process.env.NEXT_PUBLIC_API}/${warehouse || data.warehouse}/${gType || data.type}`;
            const res = await ky.post(url, {
                json: filters, timeout: 100000,
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).json();
            const d = res as any;
            setGraphData(d.data.data);
            setLoading(false);
            setError(false);
            setErrorMessage("");
        } catch (e) {
            if (e instanceof Error) return ErrorToast({ text: e.message })
            let error = e as HTTPError;
            const newError = await error.response.json();
            setError(true);
            setLoading(false);
            setErrorMessage(newError.message);
        }

    }

    const camelCaseRenderer = (value: string) => {
        return value.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
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
            case "nestedCheckbox": {
                return [];
            }
        }
    }

    const filterGraphs = () => {
        if (warehouse) {
            const ep = filters.find((item: any) => item.endpoint === warehouse);
            if (!ep) return [];
            return ep.graphs.find((item: any) => item.graphName === gType);
        }
        return [];
    }

    const handleMagnifyModal = (value: boolean): void => {
        const modal: any = {
            type, data: graphData
        }
        dispatch(setCurrentOpenState("GRAPH.Modal"))
        dispatch(setData(modal));

        dispatch(setZoomData({
            graphName: data.graphName,
            dashboardID: id
        }));

    }

    const filterSubmit = () => {
        const keys = Object.keys(request);

        const requestObject: any = {};

        keys.forEach((key, index) => {
            requestObject[key] = request[key].value;
        });
        setFilterDropdown(!filterDropdown);
        updateGraph(data.graphName, data.endpointName, requestObject);
        fetchGraphData(requestObject);
    }

    const convertToCSV = (data: any[]) => {
		var dataCopy = JSON.parse(JSON.stringify(data))
		dataCopy.splice(0, 1);
		const replacer = (key: any, value: null) => (value === null ? "" : value);
		const header = Object.keys(dataCopy[0]);
		const csv = [
			header.join(","), // column headers
			...dataCopy.map((row: any) =>
				header
					.map((fieldName) => JSON.stringify(row[fieldName], replacer))
					.join(",")
			),
		].join("\r\n");

		return csv;
	};

	const downloadCSV = (csv: BlobPart, filename: string) => {
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", filename);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const downloadJSON = (json: BlobPart, filename: string) => {
		const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", filename);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

    return (<>
        <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-primaryBackground dark:border-primaryBackground w-full animate__animated animate__fadeIn animate__slow">
            <div className="flex justify-between mb-5 text-black dark:text-white">
                <h1 className="p-1.5">{data.graphName || title}</h1>
                <div className="flex flex-row gap-1">
                    <div>
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
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="inline-flex justify-center p-1.5 text-black rounded cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-900 hover:bg-lightHover dark:hover:bg-gray-600">
                                <ArrowDownTrayIcon className="w-6 h-6" /> {/* Use an appropriate download icon */}
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
                                    <Menu.Item>
                                        <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" onClick={() => {
                                            const csv = convertToCSV(graphData.jsonData);
                                            downloadCSV(csv, 'data.csv');
                                        }}>Download CSV</span>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" onClick={() => {
															const jsonS = JSON.stringify(graphData.jsonData);
															const json = JSON.parse(jsonS);
															json.shift()
															downloadJSON(JSON.stringify(json), "data.json");
														}}>Download JSON</span>
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>

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
                                        ChartTypeArray.filter(item => {
                                            // If the dataset size is more than 1, only allow Line, Bar, and Scatter.
                                            if (graphData?.chartData?.datasets?.length > 1) {
                                                return [ChartType.Line, ChartType.Bar, ChartType.Radar, ChartType.Table, ChartType.Bubble].includes(item.type);
                                            }
                                            // Otherwise, show all chart types.
                                            return true;
                                        }).map((item, index) => {
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
            {error && !loading && <ChartCardError error={errorMessage} />}
            {!loading ? <div>
                {graphData && graphData.jsonData && type === ChartType.Bar && <BarChart data={graphData} />}
                {graphData && graphData.jsonData && type === ChartType.Pie && <PieChart data={graphData} />}
                {graphData && graphData.jsonData && type === ChartType.Line && <LineChart data={graphData} addClass="h-96" />}
                {graphData && graphData.jsonData && type === ChartType.Bubble && <BubbleChart data={graphData} />}
                {graphData && graphData.jsonData && type === ChartType.PolarArea && <PolarAreaChart data={graphData} />}
                {graphData && graphData.jsonData && type === ChartType.Radar && <RadarChart data={graphData} />}
                {graphData && graphData?.jsonData && type === ChartType.Table && <TableChart data={graphData} />}
            </div> : <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6" />}
        </div >
    </>)
}