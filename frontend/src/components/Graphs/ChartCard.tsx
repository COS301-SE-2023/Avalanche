import {
	ChartBarIcon,
	FunnelIcon,
	MagnifyingGlassPlusIcon,
	ChevronDownIcon,
	DocumentIcon,
	ShareIcon,
	ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import {
	BarChart,
	BubbleChart,
	LineChart,
	PieChart,
	PolarAreaChart,
	RadarChart,
	TableChart,
} from "@/components/Graphs";
import { useState, useEffect } from "react";
import { ChartType, ChartTypeArray } from "@/Enums";
import { ChartCardButton } from "./ChartCardHeader";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import "animate.css";
import { useDispatch, useSelector } from "react-redux";
import {
	setCurrentOpenState,
	setData,
	clearCurrentOpenState,
} from "@/store/Slices/modalManagerSlice";
import {
	CheckboxFilter,
	DatePickerFilter,
	NestedCheckbox,
	RadioboxFilter,
	ToggleFilter,
} from "./Filters";
import { Disclosure } from "@headlessui/react";
import { ChartCardError, ErrorToast, SubmitButton, FilterTooltip } from "../Util";
import { getFilters, graphState } from "@/store/Slices/graphSlice";
import { getCookie } from "cookies-next";
import ky, { HTTPError } from "ky";

interface IChartCard {
	title: string;
	data: any;
	defaultGraph: ChartType;
}

export default function ChartCard({ data, defaultGraph }: IChartCard) {
	const dispatch = useDispatch<any>();
	const stateGraph = useSelector(graphState);
	const filters = stateGraph.filters;

	useEffect(() => {
		dispatch(clearCurrentOpenState);
		if (filters.length === 0) dispatch(getFilters({}));
	}, []);

	const [type, setType] = useState<ChartType>(defaultGraph);
	const [filterDropdown, setFilterDropdown] = useState<boolean>(false);
	const [graphData, setGraphData] = useState<any>(data.data);
	const [title, setGraphTitle] = useState<any>(data.graphName);
	const [warehouse, setWarehouse] = useState<string>(data.warehouse);
	const [gType, setGType] = useState<string>(data.graphType);
	const [filtersApplied, setFiltersApplied] = useState<any>(data.filters);
	console.log(filtersApplied)
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

	const [request, setRequest] = useState<any>({});
	const [showFilterTooltip, setShowFilterTooltip] = useState<boolean>(false);

	const addRequestObject = (key: string, value: any) => {
		console.log("Adding request");
		console.log(key);
		console.log(request);
		console.log(request[key]);
		if (!request[key]) {
			const temp = { ...request };
			let object = { ...value };
			console.log(value.input);
			object.value = generateDefaultValue(value.input);
			temp[key] = object;
			setRequest(temp);
			console.log("Request");
			console.log(request);
		}
	};

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
	};

	const updateRequestObject = (key: string, value: any) => {
		if (request[key]) {
			const temp = { ...request };
			temp[key].value = value;
			setRequest(temp);
		}
	};

	const handleMagnifyModal = (): void => {
		const modal: any = {
			type,
			data: graphData,
			graphName: title,
		};
		dispatch(setCurrentOpenState("GRAPH.Modal"));
		dispatch(setData(modal));
	};

	const filterGraphs = () => {
		if (warehouse) {
			const ep = filters.find((item: any) => item.endpoint === warehouse);
			if (!ep) return [];
			return ep.graphs.find((item: any) => item.graphName === gType);
		}
		return [];
	};

	const renderFilters = () => {
		return filterGraphs()?.filters?.map((element: any, index: number) => (
			<Disclosure key={index}>
				{({ open, close }) => (
					<>
						<Disclosure.Button
							className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
							onClick={() => {
								if (element.input === "nestedCheckbox") {
									addRequestObject("transactions", element);
								} else {
									addRequestObject(element.name, element);
								}
							}}
						>
							<div className="flex gap-4 items-center">
								{camelCaseRenderer(element.name)}
							</div>
							<ChevronDownIcon className={`w-6 h-6 ${open && "rotate-180"}`} />
						</Disclosure.Button>
						<Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
							{element.input === "checkbox" && (
								<CheckboxFilter
									data={element}
									request={request[element.name]}
									update={updateRequestObject}
								/>
							)}
							{element.input === "date-picker" && (
								<DatePickerFilter
									data={element}
									request={request[element.name]}
									update={updateRequestObject}
								/>
							)}
							{element.input === "radiobox" && (
								<RadioboxFilter
									data={element}
									request={request[element.name]}
									update={updateRequestObject}
									camelCase={camelCaseRenderer}
								/>
							)}
							{element.input === "togglebox" && (
								<ToggleFilter
									data={element}
									request={request[element.name]}
									update={updateRequestObject}
								/>
							)}
							{element.input === "nestedCheckbox" && (
								<NestedCheckbox
									data={element}
									request={request["transactions"]}
									update={updateRequestObject}
								/>
							)}
						</Disclosure.Panel>
						<hr />
					</>
				)}
			</Disclosure>
		));
	};

	const filterSubmit = () => {
		const keys = Object.keys(request);

		const requestObject: any = {};

		// Map of filter names to their types for easy lookup
		const filterTypeMap: { [key: string]: string } = {};
		filterGraphs()?.filters.forEach((filter: any) => {
			filterTypeMap[filter.name] = filter.type;
		});

		keys.forEach((key, index) => {
			const currentValue = request[key].value;

			// Check if the type is string[] and the current value is a string
			if (
				filterTypeMap[key] === "string[]" &&
				typeof currentValue === "string"
			) {
				requestObject[key] = [currentValue];
			} else {
				requestObject[key] = currentValue;
			}
		});

		setFilterDropdown(!filterDropdown);
		fetchGraphData(requestObject);
	};

	const fetchGraphData = async (filters: any) => {
		setLoading(true);
		try {
			const jwt = getCookie("jwt");
			const url = data.endpointName
				? `${process.env.NEXT_PUBLIC_API}/${data.endpointName}`
				: `${process.env.NEXT_PUBLIC_API}/${warehouse || data.warehouse}/${gType || data.type
				}`;
			const res = await ky
				.post(url, {
					json: filters,
					headers: {
						Authorization: `Bearer ${jwt}`,
					},
				})
				.json();
			const d = res as any;
			setGraphData(d.data.data);
			setGraphTitle(d.data.graphName);
			setFiltersApplied(d.data.filters)
			setLoading(false);
			setError(false);
			setErrorMessage("");
		} catch (e) {
			let error = e as HTTPError;
			const newError = await error.response.json();
			setError(true);
			setLoading(false);
			setErrorMessage(newError.message);
		}
	};

	const convertToCSV = (data: any[]) => {
		const replacer = (key: any, value: null) => (value === null ? "" : value);
		const header = Object.keys(data[0]);
		const csv = [
			header.join(","), // column headers
			...data.map((row) =>
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

	const camelCaseRenderer = (value: string) => {
		return value.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
			return str.toUpperCase();
		});
	};

	return (
		<>
			<div className="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-dark-background dark:border-dark-background w-full animate__animated animate__fadeIn animate__slow z-10 graphChart max-h-[80vh] md:max-h-[70vh]">
				<div className="flex justify-between mb-5 text-black dark:text-white">
					<h1 className="p-1.5 chart-title">{title}</h1>
					<div className="flex flex-row gap-1">
						<div>
							<div
								className="inline-flex justify-center p-1.5 text-black rounded cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-900 hover:bg-lightHover dark:hover:bg-gray-600"
								onClick={() => setFilterDropdown(!filterDropdown)}
								onMouseEnter={() => setShowFilterTooltip(true)}
								onMouseLeave={() => setShowFilterTooltip(false)}
							>
								<FunnelIcon className="w-6 h-6" />
								{showFilterTooltip && <div className="relative z-20">
									<FilterTooltip filters={filtersApplied} ></FilterTooltip>
								</div>}
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
								<div className="relative z-20">
									<div className="absolute right-0  w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2 dark:bg-gray-700 max-h-72 overflow-y-scroll">
										<h1 className="text-xl underline font-semibold">Filters</h1>
										{renderFilters()}
										<SubmitButton
											text="Get Results"
											className="mt-4 w-full"
											onClick={() => filterSubmit()}
										/>
									</div>
								</div>
							</Transition>
						</div>
						<ChartCardButton
							onClick={() => {
								handleMagnifyModal();
							}}
						>
							<MagnifyingGlassPlusIcon className="w-6 h-6" />
						</ChartCardButton>
						<Menu as="div" className="inline-block text-left">
							<div>
								<Menu.Button className="inline-flex justify-center p-1.5 text-black rounded cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-900 hover:bg-lightHover dark:hover:bg-gray-600">
									<ArrowDownTrayIcon className="w-6 h-6" />{" "}
									{/* Use an appropriate download icon */}
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
								<div className="relative z-20">
									<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
										<div className="py-1">
											<Menu.Item>
												<span
													className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
													onClick={() => {
														const csv = convertToCSV(graphData.jsonData);
														downloadCSV(csv, "data.csv");
													}}
												>
													Download CSV
												</span>
											</Menu.Item>
											<Menu.Item>
												<span
													className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
													onClick={() => {
														const json = JSON.stringify(graphData.jsonData);
														downloadJSON(json, "data.json");
													}}
												>
													Download JSON
												</span>
											</Menu.Item>
										</div>
									</Menu.Items>
								</div>
							</Transition>
						</Menu>

						{/* Change bar type */}
						<Menu as="div">
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
								<div className="relative z-40">
									<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
										<div className="py-1">
											{ChartTypeArray.filter((item) => {
												if (graphData?.chartData?.datasets?.length > 1) {
													return [
														ChartType.Line,
														ChartType.Bar,
														ChartType.Radar,
														ChartType.Table,
														ChartType.Bubble,
													].includes(item.type);
												}
												return true;
											}).map((item, index) => {
												return (
													<Menu.Item key={index}>
														<span
															className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
															key={index}
															onClick={() => {
																setType(item.type);
															}}
														>
															{item.name} Chart
														</span>
													</Menu.Item>
												);
											})}
										</div>
									</Menu.Items>
								</div>
							</Transition>
						</Menu>
					</div>
				</div>
				{loading && (
					<div
						role="status"
						className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6"
					/>
				)}
				{error && !loading && <ChartCardError error={errorMessage} />}
				{!loading && !error && graphData && (
					<>
						{type === ChartType.Bar && <BarChart data={graphData} />}
						{type === ChartType.Pie && <PieChart data={graphData} />}
						{type === ChartType.Line && (
							<LineChart data={graphData} addClass="h-96" />
						)}
						{type === ChartType.Bubble && <BubbleChart data={graphData} />}
						{type === ChartType.PolarArea && (
							<PolarAreaChart data={graphData} />
						)}
						{type === ChartType.Radar && <RadarChart data={graphData} />}
						{type === ChartType.Table && <TableChart data={graphData} />}
					</>
				)}
			</div>
		</>
	);
}
