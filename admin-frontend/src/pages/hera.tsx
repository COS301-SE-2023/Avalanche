import Sidebar from "@/components/Navigation/SideBar"
import Head from "next/head";
import { MagnifyingGlassCircleIcon, QuestionMarkCircleIcon, ChevronUpDownIcon, ChevronUpIcon, BoltIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from "react";
import PageHeader from "@/components/Util/PageHeader";
import { SubmitButton, WarningAlert, ErrorToast, InputLabel, Input, AlternativeButton, Anchor } from "@/components/Util";
import { Toaster } from 'react-hot-toast';
import { IDomainWatchRequest } from "@/interfaces/requests";
import { useDispatch, useSelector } from 'react-redux';
import { IDomainWatchType } from "@/interfaces/requests/DomainWatch";
import ky, { HTTPError } from "ky";
import { getCookie } from "cookies-next";
import { selectModalManagerState, setCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { getHera, updateHeraData } from '@/store/Slices/HeraSlice';

import HeraEditor from "@/components/Util/Composite/HeraEditor";


export default function Settings() {

    /**
     * This is the regex to check the domain field. It checks that it does not contain any full stops, https:// or http://
     */
    const regex = /^(?!.*[.])(?!.*http:\/\/)(?!.*https:\/\/).*$/gm;

    const dispatch = useDispatch<any>();

    const [data, setData] = useState<any>({
        domain: "",
        types: []
    });
    const [activeHelp, setActiveHelp] = useState<string[]>([]);
    const [sorting, setSorting] = useState<string>("");
    const [sortingType, setSortingType] = useState<string>("asc");
    const [whois, setWhois] = useState<string>("");
    const modalState = useSelector(selectModalManagerState);


    /**
     * Renders out the HTML
     */
    return <>
        <Toaster />
        <Head>
            <title>Hera</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-white dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Hera" subtitle="" icon={<BoltIcon className="h-16 w-16 text-black dark:text-white" />} />
            </div>
            <div className="grid grid-cols-4 h-full">
                <div className="col-span-3 "> <HeraEditor /></div>
                <div className="col-span-1 ">
                    <div className="p-2 ">
                        <SubmitButton onClick={() => {
                            dispatch(updateHeraData({}));
                            dispatch(getHera({}));
                        }
                        } className="w-full" text={"Fetch"}></SubmitButton>
                    </div>
                </div>
            </div >
        </div>
    </>
}