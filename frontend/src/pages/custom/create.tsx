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
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import { useRouter } from 'next/router'

export default function CreateCustomDashboard() {
    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);

    return (<>
        <Head>
            <title>Dashboard</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Create a Dashboard" subtitle="Custom dashboard creator" icon={<PencilSquareIcon className="h-16 w-16 text-black dark:text-white" />} />
            </div>
            <div className="p-0 pt-4 md:p-4">
            </div>
        </div>
    </>)
}