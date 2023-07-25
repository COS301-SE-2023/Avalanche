import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { HomeIcon, PencilSquareIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { ChartCard } from "@/components/Graphs"
import { ChartType } from "@/Enums";
import { useDispatch, useSelector } from "react-redux";
import { graphState, getGraphData, getGraphDataRanking } from "@/store/Slices/graphSlice"
import { useState, useEffect } from "react";
import { ITransactionGraphRequest } from "@/interfaces/requests";
import { selectModalManagerState, setCurrentOpenState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import { SubmitButton } from "@/components/Util"
import GraphCreateModal from "@/components/Modals/GraphCreateModal";
import { getFilters } from "@/store/Slices/graphSlice"
import { Toaster } from "react-hot-toast"

export default function CreateCustomDashboard() {
    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);

    const [graphs, setGraphs] = useState<any>([]);

    const addToGraphs = (graph: any) => {
        const temp = [...graphs];
        temp.push(graph);
        setGraphs(temp);
    }

    useEffect(() => {
        dispatch(getFilters({}));
    }, []);

    useEffect(() => {
        console.log("Graphs", graphs);
        renderGraphs();
    }, [graphs]);


    const renderGraphs = () => {
        `url/warehouse/type`;
        return graphs.map((graph: any, index: number) => {
            console.log(`${process.env.NEXT_PUBLIC_API}/${graph.warehouse}/${graph.type}`);
        })
    }

    return (<>
        <Head>
            <title>Dashboard</title>
        </Head>
        <Sidebar />
        <Toaster />

        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Custom Dashboard" subtitle="Custom dashboard creator" icon={<PencilSquareIcon className="h-16 w-16 text-black dark:text-white" />} />
                <SubmitButton text="Add a graph" onClick={() => {
                    dispatch(setCurrentOpenState("GRAPH.AddGraph"))
                }} />
            </div>
            <div className="p-0 pt-4 md:p-4">
            </div>
        </div>

        {/* Modals */}
        {modalState.currentOpen === "GRAPH.AddGraph" && <GraphCreateModal state={stateGraph} add={addToGraphs} />}
    </>)
}