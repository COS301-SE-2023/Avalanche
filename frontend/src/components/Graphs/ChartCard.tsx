import { ChartBarIcon, FunnelIcon, MagnifyingGlassPlusIcon } from "@heroicons/react/24/solid";
import { BarChart, BubbleChart, LineChart, PieChart, PolarAreaChart, RadarChart } from "@/components/Graphs";
import { useState } from 'react';
import { ChartType, ChartTypeArray } from "@/Enums";
import { ChartCardButton } from "./ChartCardHeader";

interface IChartCard {
    title: string,
    data: any,
    defaultGraph: ChartType
}

export default function ChartCard({ title, data, defaultGraph }: IChartCard) {

    const [type, setType] = useState<ChartType>(defaultGraph);
    const [typeDropdown, setTypeDropdown] = useState<boolean>(false);
    const [magnifyModal, setMagnifyModal] = useState<boolean>(false);
    const [modalData, setModalData] = useState<any>({});

    const handleMagnifyModal = (value: boolean): void => {
        setMagnifyModal(value);
        document.body.style.overflow = value ? "hidden" : "visible";
    }

    return (
        <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-primaryBackground dark:border-primaryBackground w-full relative">
            <div className="flex justify-between mb-5 text-black dark:text-white">
                <h1 className="p-1.5">{title}</h1>
                <div className="flex flex-row gap-1">
                    <ChartCardButton onClick={(value: boolean) => setTypeDropdown(value)}>
                        <FunnelIcon className="w-6 h-6" />
                    </ChartCardButton>
                    <ChartCardButton onClick={(value: boolean) => setTypeDropdown(value)}>
                        <ChartBarIcon className="w-6 h-6" />
                    </ChartCardButton>
                    <ChartCardButton onClick={(value: boolean) => {
                        handleMagnifyModal(value);
                    }}>
                        <MagnifyingGlassPlusIcon className="w-6 h-6" />
                    </ChartCardButton>
                </div>
                {typeDropdown && <div className="absolute right-0 top-16 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 z-40">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        {
                            ChartTypeArray.map((item, index) => {
                                return (<li>
                                    <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" key={index} onClick={() => {
                                        setTypeDropdown(false);
                                        setType(item.type);
                                    }}>{item.name} Chart</span>
                                </li>)
                            })
                        }
                    </ul>
                </div>}
            </div>
            {type === ChartType.Bar && <BarChart data={data} />}
            {type === ChartType.Pie && <PieChart data={data} />}
            {type === ChartType.Line && <LineChart data={data} />}
            {type === ChartType.Bubble && <BubbleChart data={data} />}
            {type === ChartType.PolarArea && <PolarAreaChart data={data} />}
            {type === ChartType.Radar && <RadarChart data={data} />}

            {magnifyModal && <div id="defaultModal" tabIndex={-1} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full flex justify-center items-center bg-slate-900/50" onClick={() => { handleMagnifyModal(false) }}>
                <div className="relative w-full max-w-2xl max-h-full" onClick={(e) => e.stopPropagation()}>
                    <div className="relative bg-white rounded-lg shadow dark:bg-primaryBackground">
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                The Magnifier
                            </h3>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal" onClick={() => handleMagnifyModal(false)}>
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {type === ChartType.Bar && <BarChart data={data} />}
                            {type === ChartType.Pie && <PieChart data={data} />}
                            {type === ChartType.Line && <LineChart data={data} />}
                            {type === ChartType.Bubble && <BubbleChart data={data} />}
                            {type === ChartType.PolarArea && <PolarAreaChart data={data} />}
                            {type === ChartType.Radar && <RadarChart data={data} />}
                        </div>
                    </div>
                </div>
            </div>}

        </div>
    )
}