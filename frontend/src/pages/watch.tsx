// Levenshtein -> number of changes required to change one string to another, visual similarity -> slider from 1 - length of domain they are searching for
// Soundex -> how similar they sound, verbal similarity (speak it out loud) - slider from 1 - 4 (1 being not similar, 2 being mah i could hear it i guess, 3 being quite similar, 4 being exactly the same)
// should be togglable, both are allowed, at least one is required
// Lev, 1 is very similar, the higher you go, the more lenient you are being

import Sidebar from "@/components/Navigation/SideBar"
import Head from "next/head";
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import PageHeader from "@/components/Util/PageHeader";
import { IntegrationLoginModal } from "@/components/Modals";
import { SubmitButton, WarningAlert, ErrorToast, InputLabel, Input, Checkbox } from "@/components/Util";
import toast, { Toaster } from 'react-hot-toast';
import OrganizationSettings from "@/components/Settings/Organizations";
import API from "@/components/Settings/API";
import { domainWatchState, getDomainWatch } from "@/store/Slices/domainWatchSlice";
import { IDomainWatchRequest } from "@/interfaces/requests";
import { useDispatch, useSelector } from 'react-redux';
import { IDomainWatchType } from "@/interfaces/requests/DomainWatch";

export default function Settings() {

    const watchState = useSelector(domainWatchState);
    const dispatch = useDispatch<any>();

    const [data, setData] = useState<any>({
        domain: "",
        types: []
    });



    const update = (key: string, value: string) => {
        const temp = { ...data };
        temp[key] = value;
        setData(temp);
    }

    const checkType = (typeName: string) => {
        const temp = { ...data };
        const index = temp.types?.findIndex((type: IDomainWatchType) => type.type === typeName);
        console.log(index);
        if (index === -1) {
            console.log("does not contain");
            temp.types.push({
                type: typeName,
                threshold: 1
            } as IDomainWatchType);
            setData(temp);
        } else {
            temp.types?.splice(index, 1);
            setData(temp);
        }
    }

    const getIndexByType = (typeName: string) => {
        if (data.types?.length > 0)
            return data.types.findIndex((type: IDomainWatchType) => type.type === typeName);
        else
            return -1
    }

    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (!data.domain) {
            return ErrorToast({ text: "You must have a damain" });
        } else if (data.types.length === 0) {
            return ErrorToast({ text: "You have to have at least 1 type." });
        } else {
            // loop through types
        }

        console.log(data);

        dispatch(getDomainWatch({
            domain: data.domain,
            types: data.types
        } as IDomainWatchRequest))

    }

    const percentageCalculator = (value: number, outOf: number): number => {
        if (data.types?.length > 0)
            return (data.types[value].threshold / outOf) * 100;
        return -1
    }

    const getBackgroundColor = (value: number) => {

        return "#be123c";

    }

    function compare(a: any, b: any) {
        if (a.similarity < b.imilarity) {
            return -1;
        }
        if (a.imilarity > b.imilarity) {
            return 1;
        }
        return 0;
    }


    /**
     * Renders out the HTML
     */
    return <>
        <Toaster />
        <Head>
            <title>Domain Watch</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-white dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Domain Watch" subtitle="Watch your Domains" icon={<MagnifyingGlassCircleIcon className="h-16 w-16 text-black dark:text-white" />} />
            </div>
            <div className="p-4">
                <form className="space-y-4 md:space-y-6" onSubmit={(e) => formSubmit(e)}>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Request a Domain Watch
                    </h1>
                    <div className="flex flex-row mb-2 gap-2">
                        <div className="w-full">
                            <InputLabel htmlFor="domain" text="Domain name" />
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2">
                                Without the zone (.co.za, .africa)
                            </p>
                            <Input type="text" placeholder="standardbank" name="domain" id="domain" required={true} value={data.domain} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                update("domain", event.currentTarget.value);
                            }} />
                        </div>
                    </div>
                    <div className="flex flex-row mb-2 gap-2">
                        <div className="w-full">
                            <InputLabel htmlFor="soundex" text="Soundex" />
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2">
                                How similar the domain sounds compared to others...
                            </p>
                            <div className="flex items-start mb-2">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" onClick={() => checkType("Soundex")} />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Use</label>
                                </div>
                            </div>
                            {getIndexByType("Soundex") !== -1 && <>
                                <label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Threshold - {percentageCalculator(getIndexByType("Soundex"), 4)}% similar</label>
                                <input id="default-range" type="range" value={data.types[getIndexByType("Soundex").threshold]} min="1" max="4" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                    const num: number = parseInt(event.currentTarget.value);
                                    const temp = { ...data };
                                    temp.types[getIndexByType("Soundex")].threshold = num;
                                    setData(temp);
                                }}></input>
                            </>}
                        </div>
                        <div className="w-full">
                            <InputLabel htmlFor="levenshtein" text="Levenshtein" />
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2">
                                The visual similarity of the domain compared to others...
                            </p>
                            <div className="flex items-start mb-2">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required onClick={() => checkType("Levenshtein")} />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Use</label>
                                </div>
                            </div>
                            {getIndexByType("Levenshtein") !== -1 && data.domain.length > 0 && <>
                                <label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Threshold - {100 - percentageCalculator(getIndexByType("Levenshtein"), data.domain?.length - 1)}% not similar</label>
                                <input id="default-range" type="range" value={data.types[getIndexByType("Levenshtein").threshold]} min="1" max={`${data.domain.length - 1}`} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                    const num: number = parseInt(event.currentTarget.value);
                                    console.log(num);
                                    const temp = { ...data };
                                    temp.types[getIndexByType("Levenshtein")].threshold = num;
                                    setData(temp);
                                }}></input>
                            </>}
                        </div>
                    </div>
                    <SubmitButton loading={watchState.loading} disabled={watchState.loading} text="Get the Domains!" onClick={() => { }} />
                    {watchState.loading && <div>

                        <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 w-full">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Did you know?!</h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">Snow appears white, but it is actually translucent.</p>
                        </a>

                    </div>}
                    {!watchState.loading && <div>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Domain
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Zone
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Similarity
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !watchState.loading && watchState.data.map((item: any, index: number) => {
                                            // dark:bg-gray-800
                                            const low = "bg-white border-b dark:bg-green-700 dark:border-gray-700";
                                            const high = "bg-white border-b dark:bg-red-700 dark:border-gray-700";
                                            return <tr className={item.similarity < 70 ? low : high} key={index}>
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {item.domainName}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {item.zone}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.similarity}
                                                </td>

                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>}


                </form>
            </div >
        </div >

    </>
}