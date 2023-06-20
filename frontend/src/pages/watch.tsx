// Levenshtein -> number of changes required to change one string to another, visual similarity -> slider from 1 - length of domain they are searching for
// Soundex -> how similar they sound, verbal similarity (speak it out loud) - slider from 1 - 4 (1 being not similar, 2 being mah i could hear it i guess, 3 being quite similar, 4 being exactly the same)
// should be togglable, both are allowed, at least one is required
// Lev, 1 is very similar, the higher you go, the more lenient you are being

import Sidebar from "@/components/Navigation/SideBar"
import Head from "next/head";
import { MagnifyingGlassCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import PageHeader from "@/components/Util/PageHeader";
import { IntegrationLoginModal } from "@/components/Modals";
import { SubmitButton, WarningAlert, ErrorToast, InputLabel, Input, Checkbox, DeleteButton, AlternativeButton, Anchor } from "@/components/Util";
import toast, { Toaster } from 'react-hot-toast';
import OrganizationSettings from "@/components/Settings/Organizations";
import API from "@/components/Settings/API";
import { domainWatchState, getDomainWatch } from "@/store/Slices/domainWatchSlice";
import { IDomainWatchRequest } from "@/interfaces/requests";
import { useDispatch, useSelector } from 'react-redux';
import { IDomainWatchType } from "@/interfaces/requests/DomainWatch";

export default function Settings() {

    const regex = /^(?!.*[.])(?!.*http:\/\/)(?!.*https:\/\/).*$/gm;

    const watchState = useSelector(domainWatchState);
    const dispatch = useDispatch<any>();

    const [data, setData] = useState<any>({
        domain: "",
        types: []
    });
    const [activeHelp, setActiveHelp] = useState<string[]>([]);

    const update = (key: string, value: string) => {
        const temp = { ...data };
        temp[key] = value.trim();
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
        } else if (!regex.test(data.domain)) {
            return ErrorToast({ text: "The format is incorrect. Check that there are no full stops (.), http:// or https:// in the domain that you have entered." });
        } else if (data.types.length === 0) {
            return ErrorToast({ text: "You need to specifiy at least type, either Levenshtein or Soundex." });
        }

        for (let i = 0; i < data.types.length; i++) {
            let type: IDomainWatchType = data.types[i];
            if (type.threshold <= 0) {
                return ErrorToast({ text: `You have selected an invalid value for ${type.type}. Please reselect.` });
            }
        }

        dispatch(getDomainWatch({
            domain: data.domain,
            types: data.types
        } as IDomainWatchRequest))

    }

    const percentageCalculator = (value: number, outOf: number): number => {
        if (data.types?.length > 0)
            return Math.ceil((data.types[value].threshold / outOf) * 100);
        return -1
    }

    const onHelpClick = (value: string) => {
        const temp = [...activeHelp];
        if (temp.includes(value)) {
            temp.splice(activeHelp.indexOf(value), 1);
            setActiveHelp(temp);
        } else {
            temp.push(value);
            setActiveHelp(temp);
        }
    }

    const helpHelper = (value: string) => {
        return activeHelp.includes(value);
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
                            <InputLabel htmlFor="domain" text="Enter the domain name you want to check:" />
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2">
                                Without the zone (.co.za, .africa)
                            </p>
                            <Input type="text" placeholder="standardbank" name="domain" id="domain" required={true} value={data.domain} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                update("domain", event.currentTarget.value);
                            }} showLength={true} disabled={watchState.loading} />
                        </div>
                    </div>
                    {data.domain ? <div className="flex flex-row mb-2 gap-2 flex-col lg:flex-row">
                        <div className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-start gap-2 items-center">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" onClick={() => checkType("Soundex")} disabled={watchState.loading} />
                                </div>
                                <h3 className="block text-sm font-medium text-gray-900 dark:text-white">Soundex</h3>
                                <QuestionMarkCircleIcon className="h-5 w-5 hover:text-avalancheBlue cursor-pointer" onClick={() => onHelpClick("Soundex")} />
                            </div>
                            {helpHelper("Soundex") && <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2">
                                Soundex is a method used to simplify and <span className="font-semibold">standardize the representation of names based on their sound</span>. It assigns a code to each name so that similar-sounding names have the same code. This helps in grouping and matching names with <span className="font-semibold">similar pronunciations, even if they are spelled differently</span>. It's often used for tasks like searching databases or linking records where the <span className="font-semibold">pronunciation matters more than the exact spelling</span>. <Anchor href="https://en.wikipedia.org/wiki/Soundex" text="Wikipedia" />.<br /><br />The higher the percentage, the higher Soundex match you want.
                            </p>}
                            {getIndexByType("Soundex") !== -1 && <>
                                <label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Similarity - {percentageCalculator(getIndexByType("Soundex"), 4)}% similar</label>
                                <input id="default-range" type="range" value={data.types[getIndexByType("Soundex").threshold]} min="1" max="4" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                    const num: number = parseInt(event.currentTarget.value);
                                    const temp = { ...data };
                                    temp.types[getIndexByType("Soundex")].threshold = num;
                                    setData(temp);
                                }} disabled={watchState.loading} />
                            </>}
                        </div>
                        <div className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-start gap-2 items-center">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" onClick={() => checkType("Levenshtein")} disabled={watchState.loading} required={data.types.length} />
                                </div>
                                <h3 className="block text-sm font-medium text-gray-900 dark:text-white">Levenshtein</h3>
                                <QuestionMarkCircleIcon className="h-5 w-5 hover:text-avalancheBlue cursor-pointer" onClick={() => onHelpClick("Levenshtein")} />
                            </div>

                            {helpHelper("Levenshtein") && <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2">
                                Levenshtein distance is a measure of <span className="font-semibold">how different two strings are in terms of their characters</span>. It calculates the minimum number of operations required to transform one string into another. The operations include inserting, deleting, or substituting a character. Essentially, it tells us how many changes we need to make to turn one string into the other. It's commonly used in fields like spell checking, DNA sequence analysis, and fuzzy string matching. <Anchor href="https://en.wikipedia.org/wiki/Levenshtein_distance" text="Wikipedia" /><br /><br />The higher the percentage, the stricter the algorithm is.
                            </p>}
                            {getIndexByType("Levenshtein") !== -1 && data.domain.length > 0 && <>
                                <label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Similarity - {100 - percentageCalculator(getIndexByType("Levenshtein"), data.domain?.length - 1)}%</label>
                                <input id="default-range" type="range" value={data.types[getIndexByType("Levenshtein").threshold]} min="1" max={`${data.domain.length - 1}`} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 rotate-180" onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                    const num: number = parseInt(event.currentTarget.value);
                                    const temp = { ...data };
                                    temp.types[getIndexByType("Levenshtein")].threshold = num;
                                    setData(temp);
                                }} disabled={watchState.loading} />
                            </>}
                        </div>
                    </div> : <WarningAlert title="Missing domain." text="You need to provide the domain name before you can continue" />}

                    {/* Buttons */}
                    <div className="flex gap-2">
                        <SubmitButton loading={watchState.loading} disabled={watchState.loading} text="Get the Domains!" onClick={() => { }} />
                        {!watchState.loading && watchState.data.length > 0 && <AlternativeButton text="Clear Results" onClick={() => { }} />}
                    </div>

                    {/* Fun Fact Card */}
                    {watchState.loading && <div>
                        <a href="#" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 w-full">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">We are fetching some domains...</h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">Snow appears white, but it is actually translucent.</p>
                        </a>
                    </div>}

                    {/* Data Representation */}
                    {!watchState.loading && watchState.data.length > 0 && <div>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-primaryBackground dark:text-gray-300">
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