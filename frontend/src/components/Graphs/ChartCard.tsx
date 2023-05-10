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
                    <ChartCardButton onClick={(value: boolean) => setTypeDropdown(value)}>
                        <MagnifyingGlassPlusIcon className="w-6 h-6" />
                    </ChartCardButton>
                </div>
                {/* <div className={`${typeDropdown && 'max-h-full w-full h-screen fixed'}`} onClick={() => setTypeDropdown(false)}> */}
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
                        {/* <li>
                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Dashboard</span>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
                        </li> */}
                    </ul>
                </div>}
            </div>
            {type === ChartType.Bar && <BarChart data={data} />}
            {type === ChartType.Pie && <PieChart data={data} />}
            {type === ChartType.Line && <LineChart data={data} />}
            {type === ChartType.Bubble && <BubbleChart data={data} />}
            {type === ChartType.PolarArea && <PolarAreaChart data={data} />}
            {type === ChartType.Radar && <RadarChart data={data} />}
        </div>
    )
}