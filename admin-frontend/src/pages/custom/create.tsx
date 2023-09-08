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
import { v4 as uuidv4 } from 'uuid';
import { Input, InputLabel, SubmitButton } from "@/components/Util"

export default function CreateCustomDashboard() {
    const dispatch = useDispatch<any>();
    const router = useRouter();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);

    const [name, setName] = useState<string>("");

    /**
     * This function handles the form submit.
     * @param event is the event triggered by the form
     */
    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        router.push({
            pathname: `/custom/${uuidv4()}`,
            query: { name: name },
        }, undefined, {
            shallow: false
        })
    }

    return (<>
        <Head>
            <title>Dashboard</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Create a Dashboard" subtitle="Custom Dashboard Creator" icon={<PencilSquareIcon className="h-16 w-16 text-black dark:text-white" />} />
            </div>
            <div className="p-0 pt-4 md:p-4">
                <form onSubmit={(event) => formSubmit(event)} className='flex flex-col gap-5'>
                    <div>
                        <InputLabel htmlFor="name" text="Dashboard Name" />
                        <Input type="text" name="name" id="name" placeholder="Paper Sales" required={true} value={name} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            setName(event.currentTarget.value);
                        }} maxLength={20} />
                    </div>
                    <SubmitButton text="Create Dashboard" onClick={(event: React.FormEvent<HTMLFormElement>) => {
                        formSubmit(event);
                    }} className="w-full" />
                </form>
            </div>
        </div>
    </>)
}