import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { HomeIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { ChartCard } from "@/components/Graphs"
import { chartData } from "@/components/Graphs/data";
import { ChartType } from "@/Enums";
import { useDispatch, useSelector } from "react-redux";
import { graphState, getGraphData } from "@/store/Slices/graphSlice"
import { useState, useEffect } from "react";
import { ITransactionGraphRequest } from "@/interfaces/requests"

export default function Dashboard() {

    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);

    useEffect(() => {
        const data: ITransactionGraphRequest = { zone: "CO.ZA", granularity: "week", group: "registrar", dateFrom: "2023-01-02", graphName: "Your mom" };
        dispatch(getGraphData(data));
    }, [])

    return (<>
        <Head>
            <title>Dashboard</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Home" subtitle="Insights at your fingertips" icon={<HomeIcon className="h-16 w-16 text-black dark:text-white" />} />
            </div>
            <div className="p-0 pt-4 md:p-4">
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4 mb-4 grid-rows-2">
                    {
                        stateGraph?.graphs.map((data: any, index: number) => {
                            return <ChartCard title={data.graphName} data={data} defaultGraph={ChartType.Line} key={index} />
                        })
                    }
                    {
                        stateGraph.loading && <>
                            <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                                <div className="flex gap-1">
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-700 w-32"></div>
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-700 w-32"></div>
                                </div>
                            </div>
                        </>
                    }
                    {/* <ChartCard title="A ChartJS Chart 1" data={chartData} defaultGraph={ChartType.Pie} />
                    <ChartCard title="A ChartJS Chart 2" data={chartData} defaultGraph={ChartType.Bar} />
                    <ChartCard title="A ChartJS Chart 3" data={chartData} defaultGraph={ChartType.Line} />
                    <ChartCard title="A ChartJS Chart 4" data={chartData} defaultGraph={ChartType.Radar} />
                    <ChartCard title="A ChartJS Chart 5" data={chartData} defaultGraph={ChartType.PolarArea} /> */}
                </div>
            </div>
        </div>
    </>)
}