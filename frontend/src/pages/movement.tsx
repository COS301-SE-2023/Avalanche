import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { BoltIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { ChartCard } from "@/components/Graphs"
import { ChartType } from "@/Enums";
import { useDispatch, useSelector } from "react-redux";
import { graphState, getDomainNameAnalysisData, getMovementVerticalData } from "@/store/Slices/graphSlice"
import { useState, useEffect } from "react";
import { ITransactionGraphRequest } from "@/interfaces/requests";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import IDomainNameAnalysisGraphRequest from "@/interfaces/requests/DomainNameAnalysis"
import { stubFalse } from "cypress/types/lodash"
import IMovementGraphRequest from "@/interfaces/requests/Movement"

export default function Movement() {

    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);

    const pad = (d: number) => {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    useEffect(() => {
        // const data: ITransactionGraphRequest = { zone: "CO.ZA", granularity: "week", group: "registrar", dateFrom: "2023-01-02", graphName: "Your mom" };

        const arrayMovementVerticalShare: IMovementGraphRequest[] = [];

        const movementVertical: IMovementGraphRequest = { zone: ["WIEN"], };
        arrayMovementVerticalShare.push(movementVertical);

        const movementVerticalRegistrar: IMovementGraphRequest = { zone: ["WIEN"], registrar: ["1und1", "registrygate", "internetx"] };
        arrayMovementVerticalShare.push(movementVerticalRegistrar);


        arrayMovementVerticalShare.forEach(data => {
            dispatch(getMovementVerticalData(data));
        })


        // dispatch(getGraphDataArray(array));
    }, [])

    return (<>
        <Head>
            <title>Nett Movement</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Nett Movement" subtitle="Insights at your fingertips" icon={<BoltIcon className="h-16 w-16 text-black dark:text-white" />} />
            </div>
            <div className="p-0 pt-4 md:p-4">
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4 mb-4 grid-rows-2">
                    {
                        stateGraph.graphs?.length > 0 && stateGraph.graphs.map((data: any, index: number) => {
                            if (data) return <ChartCard title={data.graphName} data={data} defaultGraph={ChartType.Line} key={index} />
                        })
                    }
                    {
                        stateGraph.loading && <>
                            <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
                                <div className="flex gap-1">
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800  w-32 p-1.5"></div>
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32 p-1.5"></div>
                                </div>
                            </div>
                            <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
                                <div className="flex gap-1">
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                </div>
                            </div>
                            <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
                                <div className="flex gap-1">
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                </div>
                            </div>
                            <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
                                <div className="flex gap-1">
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
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
        {
            modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />
        }
    </>)
}