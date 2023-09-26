import PickeeModal from "@/components/Modals/PickeeModal";
import WHOISModal from "@/components/Modals/WHOISModal";
import Sidebar from "@/components/Navigation/SideBar";
import { AlternativeButton, Anchor, ErrorToast, Input, InputLabel, MainContent, SubmitButton, Toggle, WarningAlert } from "@/components/Util";
import PageHeader from "@/components/Util/PageHeader";
import { IDomainWatchRequest } from "@/interfaces/requests";
import { IDomainWatchType } from "@/interfaces/requests/DomainWatch";
import { domainWatchState, getDomainWatch, updateChanging } from "@/store/Slices/domainWatchSlice";
import { selectModalManagerState, setCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { ChevronUpDownIcon, ChevronUpIcon, MagnifyingGlassCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { getCookie } from "cookies-next";
import ky, { HTTPError } from "ky";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

export default function Settings() {

    /**
     * This is the regex to check the domain field. It checks that it does not contain any full stops, https:// or http://
     */
    const regex = /^(?!.*[.])(?!.*http:\/\/)(?!.*https:\/\/).*$/gm;

    const watchState = useSelector(domainWatchState);
    const modalState = useSelector(selectModalManagerState);
    const dispatch = useDispatch<any>();

    const [data, setData] = useState<any>({
        domain: "",
        types: [],
        resolve: "false"
    });
    const [activeHelp, setActiveHelp] = useState<string[]>([]);
    const [sorting, setSorting] = useState<string>("");
    const [sortingType, setSortingType] = useState<string>("asc");
    const [whois, setWhois] = useState<string>("");
    const [pickee, setPickee] = useState<string>("");
    const [pickeeLoading, setPickeeLoading] = useState<boolean>(false);
    const [whoisLoading, setWhoisLoading] = useState<boolean>(false);

    /**
     * This function watched the watchState for the variable to change.
     */
    useEffect(() => {
        if (watchState.error) {
            return ErrorToast({ text: watchState.error });
        }
    }, [watchState.error])

    /**
     * This is only used to update the data state object, and more specifially the domain attribute in the object.
     * @param key the key in the data object
     * @param value the new value it should be
     */
    const update = (key: string, value: string) => {
        const temp = { ...data };
        temp[key] = value.trim();
        setData(temp);
    }

    /**
     * This handles the multiple different types of algorithms that are available. It pushes or removes from the data.types attribute.
     * @param typeName is the type of algorithm you want it to go on
     */
    const checkType = (typeName: string) => {
        const temp = { ...data };
        const index = temp.types?.findIndex((type: IDomainWatchType) => type.type === typeName);
        if (index === -1) {
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

    /**
     * If the type is found based on the name, it returns the index of that type from the data.types array
     * @param typeName is the type that we are looking for
     * @returns the index in the data.types array
     */
    const getIndexByType = (typeName: string): number => {
        if (data.types?.length > 0)
            return data.types.findIndex((type: IDomainWatchType) => type.type === typeName);
        else
            return -1
    }

    /**
     * This handles the form submit for the domain watch, it does validation and then updates state and dispatches an action.
     * @param event is the event that is related to the form
     */
    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (!data.domain) {
            return ErrorToast({ text: "You must have a domain" });
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
            types: data.types,
            // resolve: data.resolve
        } as IDomainWatchRequest))

    }

    /**
     * Helper function to get the percentage for the two types.
     * @param value is the index of the type
     * @param outOf is what it should be out of
     * @returns the percentage value
     */
    const percentageCalculator = (value: number, outOf: number): number => {
        if (data.types?.length > 0) return Math.ceil((data.types[value].threshold / outOf) * 100);
        return -1
    }

    /**
     * Helper function that updates the activeHelp state object, and is used to see what help sections should be open and which should be closed.
     * @param value is the type of helper that should be handled.
     */
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

    /**
     * A helper function that checks whether a value is in an array or not.
     * @param value is the value we are looking for
     * @returns a boolean being either true or false
     */
    const helpHelper = (value: string): boolean => {
        return activeHelp.includes(value);
    }

    /**
     * Helper function to help get the background colour.
     * @param value nmber value
     * @returns a class string
     */
    const getColour = (value: number): string => {
        const data = "bg-white border-b-2 dark:border-gray-800 ";
        if (value <= 10) {
            return data + "dark:bg-gray-700 hover:border-b-2 hover:border-[#008000]"
        } else if (value > 10 && value <= 20) {
            return data + "dark:bg-gray-700 hover:border-b-2 hover:border-[#00BF40]"
        } else if (value > 20 && value <= 30) {
            return data + "dark:bg-gray-700 hover:border-b-2 hover:border-[#00FF00]"
        } else if (value > 30 && value <= 40) {
            return data + "dark:bg-gray-700 hover:border-b-2 hover:border-[#40FF00]"
        } else if (value > 40 && value <= 50) {
            return data + "dark:bg-gray-700 hover:border-b-2 hover:border-[#80FF00]"
        } else if (value > 50 && value <= 60) {
            return data + "dark:bg-gray-700 hover:border-b-2 hover:border-[#BFFF00]"
        } else if (value > 60 && value <= 70) {
            return data + "dark:bg-gray-700 hover:border-b-2 hover:border-[#FFFF00]"
        } else if (value > 70 && value <= 80) {
            return data + "dark:bg-gray-700 hover:border-b-2 hover:border-[#FFBF00]"
        } else if (value > 80 && value <= 90) {
            return data + "dark:bg-gray-700 hover:border-b-2 hover:border-[#FF8000]"
        } else if (value > 90 && value < 100) {
            return data + "dark:bg-gray-700 hover:border-b-2 hover:border-[#FF4000]"
        } else {
            return data + "dark:bg-gray-700 hover:border-b-2 hover:border-[#FF0000]"
        }
    }

    /**
     * Returns the indicator string
     * @param value 
     * @returns 
     */
    const getIndicator = (value: number) => {
        return `bg-indicator-${Math.floor((value / 10) + 1)}`;
    }

    /**
     * This useEffect helps us sort the functions
     */
    useEffect(() => {
        if (!sorting) {
            dispatch(updateChanging(watchState.data));
        } else {
            if (sorting === "similarity") {
                let temp = [...watchState.changingData];
                if (sortingType === "asc") {
                    temp = temp.sort((a: any, b: any) => parseFloat(a.similarity) - parseFloat(b.similarity));
                    dispatch(updateChanging(temp));
                } else {
                    temp = temp.sort((a: any, b: any) => parseFloat(b.similarity) - parseFloat(a.similarity));
                    dispatch(updateChanging(temp));
                }
            } else if (sorting === "zone") {
                let temp = [...watchState.changingData];
                if (sortingType === "asc") {
                    temp = temp.sort((a, b) => { return (a.zone > b.zone) ? 1 : ((b.zone > a.zone) ? -1 : 0); });
                    dispatch(updateChanging(temp));
                } else {
                    temp = temp.sort((a, b) => { return (a.zone < b.zone) ? 1 : ((b.zone < a.zone) ? -1 : 0); });
                    dispatch(updateChanging(temp));
                }
            } else if (sorting === "domainName") {
                let temp = [...watchState.changingData];
                if (sortingType === "asc") {
                    temp = temp.sort((a, b) => { return (a.domainName > b.domainName) ? 1 : ((b.domainName > a.domainName) ? -1 : 0); });
                    dispatch(updateChanging(temp));
                } else {
                    temp = temp.sort((a, b) => { return (a.domainName < b.domainName) ? 1 : ((b.domainName < a.domainName) ? -1 : 0); });
                    dispatch(updateChanging(temp));
                }
            }
        }
    }, [sorting, sortingType]);

    /**
     * 
     * @param domain 
     */
    const getWhoIS = async (domain: string) => {
        setWhoisLoading(true);
        try {
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/domain-watch/whoisyou`, {
                json: {
                    domain
                },
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json();
            const data = res as any;
            setWhois(data.data);
            dispatch(setCurrentOpenState("WATCH.WHOIS"));
            setWhoisLoading(false);
        } catch (e) {
            setWhoisLoading(false);
            let error = e as HTTPError;
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                return ErrorToast({ text: errorJson.message });
            }
        }
    }

    /**
     * Handles the picture taking
     * @param domain 
     */
    const getTakePickeeNow = async (domain: string) => {
        setPickeeLoading(true);
        try {
            const domainName = domain;
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/domain-watch/takePickeeNow`, {
                json: {
                    domainName
                }, timeout: false,
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json();
            setPickeeLoading(false);
            const data = res as any;
            setPickee(data.data);
            dispatch(setCurrentOpenState("WATCH.TAKEPICKEENOW"));
        } catch (e) {
            setPickeeLoading(false);
            let error = e as HTTPError;
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                return ErrorToast({ text: errorJson.message });
            }
        }
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

        <MainContent>
            <div className="flex justify-between items-center">
                <PageHeader title="Domain Watch" subtitle="Watch your Domains" icon={<MagnifyingGlassCircleIcon className="h-16 w-16 text-black dark:text-white" />} />
            </div>
            <div className="p-4">
                <form className="space-y-4 md:space-y-6 mb-4" onSubmit={(e) => formSubmit(e)}>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Request a Domain Watch
                    </h1>
                    <div className="flex flex-row mb-2 gap-2">
                        <div className="w-full">
                            <InputLabel htmlFor="domain" text="Enter the domain name you want to check:" />
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2">
                                Without the tld (.co.za, .africa). <Anchor href="https://www.semrush.com/blog/top-level-domains/" text="What are TLD's?" target="_blank" />
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
                                <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 hover:text-avalancheBlue cursor-pointer" onClick={() => onHelpClick("Soundex")} />
                            </div>
                            {helpHelper("Soundex") && <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2">
                                Soundex is a method used to simplify and <span className="font-semibold">standardize the representation of names based on their sound</span>. It assigns a code to each name so that similar-sounding names have the same code. This helps in grouping and matching names with <span className="font-semibold">similar pronunciations, even if they are spelled differently</span>. It&apos;s often used for tasks like searching databases or linking records where the <span className="font-semibold">pronunciation matters more than the exact spelling</span>. <Anchor href="https://en.wikipedia.org/wiki/Soundex" text="Wikipedia" /><br /><br />The higher the percentage, the higher Soundex match you want.
                            </p>}
                            {getIndexByType("Soundex") !== -1 && <div className="mt-2">
                                <label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Similarity - {percentageCalculator(getIndexByType("Soundex"), 4)}%</label>
                                <input id="default-range" type="range" value={data.types[getIndexByType("Soundex")].threshold} min="1" max="4" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                    const num: number = parseInt(event.currentTarget.value);
                                    const temp = { ...data };
                                    temp.types[getIndexByType("Soundex")].threshold = num;
                                    setData(temp);
                                }} disabled={watchState.loading} />
                            </div>}
                        </div>
                        <div className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-start gap-2 items-center">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" onClick={() => checkType("Levenshtein")} disabled={watchState.loading} />
                                </div>
                                <h3 className="block text-sm font-medium text-gray-900 dark:text-white">Levenshtein</h3>
                                <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 hover:text-avalancheBlue cursor-pointer" onClick={() => onHelpClick("Levenshtein")} />
                            </div>

                            {helpHelper("Levenshtein") && <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2">
                                Levenshtein distance is a measure of <span className="font-semibold">how different two strings are in terms of their characters</span>. It calculates the minimum number of operations required to transform one string into another. The operations include inserting, deleting, or substituting a character. Essentially, it tells us how many changes we need to make to turn one string into the other. It&apos;s commonly used in fields like spell checking, DNA sequence analysis, and fuzzy string matching. <Anchor href="https://en.wikipedia.org/wiki/Levenshtein_distance" text="Wikipedia" /><br /><br />The higher the percentage, the stricter the algorithm is.
                            </p>}
                            {getIndexByType("Levenshtein") !== -1 && data.domain.length > 0 && <div className="mt-2">
                                <label htmlFor="lev-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Similarity - {100 - percentageCalculator(getIndexByType("Levenshtein"), data.domain?.length - 1)}%</label>
                                <input id="lev-range" type="range" value={data.types[getIndexByType("Levenshtein")].threshold} min="1" max={data.domain.length - 1} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 rotate-180" onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                    const num: number = parseInt(event.currentTarget.value);
                                    const temp = { ...data };
                                    temp.types[getIndexByType("Levenshtein")].threshold = num;
                                    setData(temp);
                                }} disabled={watchState.loading} />
                            </div>}
                        </div>
                    </div> : <WarningAlert title="Missing domain." text="You need to provide the domain name before you can continue" />}

                    {data.domain.length > 0 && <Toggle name="resolveToggle" id="resolveToggle" label="Do you want the domain to resolve?" onChange={(changed: boolean) => update("resolve", changed ? "true" : "false")} value={data.resolve === "true" ? true : false} />}

                    {/* Buttons */}
                    <div className="flex gap-2">
                        <SubmitButton loading={watchState.loading} disabled={watchState.loading} text="Get the Domains!" onClick={() => { }} />
                        {!watchState.loading && watchState.data.length > 0 && <AlternativeButton text="Clear Results" onClick={() => { }} />}
                    </div>
                </form>
                {/* Fun Fact Card */}
                {watchState.loading && <div>

                    <div role="status" className="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-customPulse dark:divide-gray-700 md:p-6 dark:border-gray-700 dark:bg-gray-400">
                        <div className="flex items-center justify-between">
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32 "></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-20"></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32 "></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-20"></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32 "></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-20"></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32 "></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-20"></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32 "></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-20"></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32 "></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-20"></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32 "></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-20"></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32 "></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-20"></div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <span className="sr-only">Loading...</span>
                    </div>

                </div>}

                {/* Data Representation */}
                {!watchState.loading && watchState.changingData.length > 0 && <div>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-primaryBackground dark:text-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3 cursor-pointer w-100" onClick={() => {
                                        sorting !== "domainName" && setSorting("domainName");
                                        sortingType === "asc" ? setSortingType("desc") : setSortingType("asc");
                                    }}>
                                        <div className="flex gap-2 items-center">
                                            Domain {sorting === "domainName" ? <ChevronUpIcon className={sortingType === "asc" ? "h-4 w-4" : "rotate-180 h-w w-4"} /> : <ChevronUpDownIcon className="h-4 w-4" />}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer w-100" onClick={() => {
                                        sorting !== "zone" && setSorting("zone");
                                        sortingType === "asc" ? setSortingType("desc") : setSortingType("asc");
                                    }}>
                                        <div className="flex gap-2 items-center">
                                            Zone {sorting === "zone" ? <ChevronUpIcon className={sortingType === "asc" ? "h-4 w-4" : "rotate-180 h-w w-4"} /> : <ChevronUpDownIcon className="h-4 w-4" />}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer w-100" onClick={() => {
                                        sorting !== "similarity" && setSorting("similarity");
                                        sortingType === "asc" ? setSortingType("desc") : setSortingType("asc");
                                    }}>
                                        <div className="flex gap-2 items-center">
                                            Similarity {sorting === "similarity" ? <ChevronUpIcon className={sortingType === "asc" ? "h-4 w-4" : "rotate-180 h-w w-4"} /> : <ChevronUpDownIcon className="h-4 w-4" />}
                                        </div>
                                    </th>

                                    <th scope="col" className="px-6 py-3 cursor-pointer w-52">
                                        <div className="flex gap-2 items-center">
                                            WhoIS Search
                                        </div>
                                    </th>

                                    <th scope="col" className="px-6 py-3 cursor-pointer w-52">
                                        <div className="flex gap-2 items-center">
                                            Get Domain Screenshot
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    !watchState.loading && watchState.changingData.map((item: any, index: number) => {
                                        return <tr className={getColour(item.similarity) + " duration-75 ease-in-out"} key={index}>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.domainName}
                                            </th>
                                            <td className="px-6 py-4 dark:text-white text-gray-900">
                                                {item.zone}
                                            </td>
                                            <td className="px-6 py-4 dark:text-white text-gray-900">
                                                <span className="flex items-center gap-2">
                                                    <span className="relative inline-flex h-3 w-3 z-5">
                                                        <span className={"animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 " + getIndicator(item.similarity)}></span>
                                                        <span className={"relative inline-flex rounded-full h-3 w-3 " + getIndicator(item.similarity)}></span>
                                                    </span>
                                                    {item.similarity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 dark:text-white text-gray-900">
                                                <SubmitButton loading={whoisLoading} disabled={whoisLoading} text="WHOIS Search" onClick={() => getWhoIS(`${item.domainName}.${item.zone.toLowerCase()}`)} />
                                            </td>
                                            <td className="px-6 py-4 dark:text-white text-gray-900">
                                                <SubmitButton loading={pickeeLoading} disabled={pickeeLoading} text="Take a picture of the domain " onClick={() => getTakePickeeNow(`${item.domainName}.${item.zone.toLowerCase()}`)} />
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                </div>}
            </div >
        </MainContent>
        {modalState.currentOpen === "WATCH.WHOIS" && <WHOISModal data={whois} />}
        {modalState.currentOpen === "WATCH.TAKEPICKEENOW" && <PickeeModal data={pickee} />}
    </>
}