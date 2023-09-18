import { getCookie } from "cookies-next";
import { Anchor, ErrorToast, Input, SubmitButton, SuccessToast, WarningAlert } from "../Util"
import ky, { HTTPError } from "ky";
import { useDispatch } from "react-redux";
import { updateAPI } from "@/store/Slices/userSlice";
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuestionMarkCircleIcon, ClipboardIcon } from "@heroicons/react/24/solid";

interface IGeneralSettings {
    user: any
}

interface PassiveEntry {
    id: string,
    domain: string
}

interface PassiveTypes {
    type: string,
    threshold: number
}

interface PassiveSave {
    types: PassiveTypes[],
    domains: string[]
}

export default function GeneralSettings({ user }: IGeneralSettings) {

    const dispatch = useDispatch<any>();
    const [passive, setPassive] = useState<PassiveEntry[]>([]);
    const [activeHelp, setActiveHelp] = useState<string[]>([]);
    const [apiKey, setAPIKey] = useState<string>("");

    const [types, setTypes] = useState<PassiveTypes[]>([]);

    useEffect(() => {
        getDomains();
    }, [])

    const getDomains = async () => {
        try {
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/getDomainWatchPassiveUser`, {
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json();
            const data = res as any;
            for (let type in data.message.watched.types) {
                checkType(data.message.watched.types[type].type);
            }
            setTypes(data.message.watched.types);

            // populate domains
            setPassive(data.message.watched.domains.map((item: any) => {
                return {
                    domain: item,
                    id: uuidv4()
                }
            }));

        } catch (e) {

        }
    }

    const renderPassive = () => {
        return passive.map((item: PassiveEntry, index: number) => {
            return (
                <div className="relative w-full" key={index}>
                    <input type="text" className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="dunder mifflin" onChange={(e) => {
                        const temp = [...passive];
                        const index = temp.findIndex(object => {
                            return object.id === item.id;
                        });
                        if (index === -1) return;
                        temp[index].domain = e.target.value;
                        setPassive(temp);
                    }} value={item?.domain} />
                    <button className="text-white absolute right-2.5 bottom-2.5 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" onClick={() => deletePassive(item.id)}>Remove</button>
                </div>
            )
        })
    }

    const deletePassive = (id: string) => {
        let temp = [...passive];
        const index = temp.findIndex((find: PassiveEntry) => find.id === id);
        if (index === -1) return;
        temp.splice(index, 1);
        setPassive(temp);
    }

    const helpHelper = (value: string): boolean => {
        return activeHelp.includes(value);
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

    const checkType = (typeName: string) => {
        const temp = [...types];
        const index = temp.findIndex((type: PassiveTypes) => type.type === typeName);
        if (index === -1) {
            temp.push({
                type: typeName,
                threshold: 1
            } as PassiveTypes);
            setTypes(temp);
        } else {
            temp?.splice(index, 1);
            setTypes(temp);
        }
    }

    const getIndexByType = (typeName: string): number => {
        if (types?.length > 0)
            return types.findIndex((type: PassiveTypes) => type.type === typeName);
        else
            return -1
    }

    const percentageCalculator = (value: number, outOf: number): number => {
        if (types?.length > 0) return Math.ceil((types[value].threshold / outOf) * 100);
        return -1
    }

    const createAPIKey = async () => {
        try {
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/createAPIKey`, {
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json();
            dispatch(updateAPI(true));
            const data = res as any;
            setAPIKey(data.message);
            SuccessToast({ text: "Successfully created API Key." })
        } catch (e) {
            let error = e as HTTPError;
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                ErrorToast({ text: errorJson.message });
                return dispatch(updateAPI(true));
            }
        }
    }

    const rerollAPIKey = async () => {
        try {
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/rerollAPIKey`, {
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json();
            const data = res as any;
            setAPIKey(data.message);
            dispatch(updateAPI(true));
            SuccessToast({ text: "Successfully rerolled API Key." })
        } catch (e) {
            let error = e as HTTPError;
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                return ErrorToast({ text: errorJson.message });
            }
        }
    }

    const passiveSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (passive.length === 0) {
            return ErrorToast({ text: "You need some domains." })
        } else if (types.length === 0) {
            return ErrorToast({ text: "You need to specify algorithm checkes." })
        }

        const obj: PassiveSave = {
            types: types,
            domains: passive.map((item) => item.domain)
        }

        try {
            await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/addDomainWatchPassiveDetails`, {
                json: obj,
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json();
            return SuccessToast({ text: "Successfully Saved" });
        } catch (e) {
            let error = e as HTTPError;
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                return ErrorToast({ text: errorJson.message });
            }
        }
    }

    return (
        <>
            <div className="flex gap-5 flex-col">
                <div className="flex flex-col">
                    {/* API Keys */}
                    <h4 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">API Key</h4>
                    <div className="flex gap-5 justify-between items-center">
                        {!apiKey ? <WarningAlert title="API Key." text={user.user.apiCheck ? "You already have an API Key" : "You have no API key registered."} className="flex-auto" /> : <div className="relative flex-auto">
                            <input type="text" className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="dunder mifflin" value={apiKey} />
                            <button className="text-white absolute right-2.5 bottom-2.5 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"><ClipboardIcon className="w-4 h-4" onClick={() => {
                                navigator.clipboard.writeText(apiKey);
                                SuccessToast({ text: "Copied API Key to clipboard." })
                            }} /></button>
                        </div>}
                        <SubmitButton text={user.user.apiCheck ? "Reroll API Key" : "Create an API Key"} onClick={() => {
                            if (!user.user.apiCheck) {
                                createAPIKey();
                            } else {
                                rerollAPIKey();
                            }
                        }} className="h-full flex-nowrap" />
                    </div>
                </div>
                <div className="flex flex-col">
                    {/* Passive Domain Watch */}
                    <h4 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">Passive Domain Watch</h4>
                    <div className="flex flex-row mb-2 gap-2 flex-col lg:flex-row">
                        <div className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-start gap-2 items-center">
                                <div className="flex items-center h-5">
                                    <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" checked={getIndexByType("Soundex") !== -1} onClick={() => checkType("Soundex")} onChange={() => { }} />
                                </div>
                                <h3 className="block text-sm font-medium text-gray-900 dark:text-white">Soundex</h3>
                                <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 hover:text-avalancheBlue cursor-pointer" onClick={() => onHelpClick("Soundex")} />
                            </div>
                            {helpHelper("Soundex") && <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2">
                                Soundex is a method used to simplify and <span className="font-semibold">standardize the representation of names based on their sound</span>. It assigns a code to each name so that similar-sounding names have the same code. This helps in grouping and matching names with <span className="font-semibold">similar pronunciations, even if they are spelled differently</span>. It&apos;s often used for tasks like searching databases or linking records where the <span className="font-semibold">pronunciation matters more than the exact spelling</span>. <Anchor href="https://en.wikipedia.org/wiki/Soundex" text="Wikipedia" /><br /><br />The higher the percentage, the higher Soundex match you want.
                            </p>}
                            {getIndexByType("Soundex") !== -1 && <div className="mt-2">
                                <label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Similarity - {percentageCalculator(getIndexByType("Soundex"), 4)}%</label>
                                <input id="default-range" type="range" value={types[getIndexByType("Soundex")].threshold} min="1" max="4" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                    const num: number = parseInt(event.currentTarget.value);
                                    const temp = [...types];
                                    temp[getIndexByType("Soundex")].threshold = num;
                                    setTypes(temp);
                                }} />
                            </div>}
                        </div>
                        <div className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-start gap-2 items-center">
                                <div className="flex items-center h-5">
                                    <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" checked={getIndexByType("Levenshtein") !== -1} onClick={() => checkType("Levenshtein")} onChange={() => { }} />
                                </div>
                                <h3 className="block text-sm font-medium text-gray-900 dark:text-white">Levenshtein</h3>
                                <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 hover:text-avalancheBlue cursor-pointer" onClick={() => onHelpClick("Levenshtein")} />
                            </div>

                            {helpHelper("Levenshtein") && <p className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2">
                                Levenshtein distance is a measure of <span className="font-semibold">how different two strings are in terms of their characters</span>. It calculates the minimum number of operations required to transform one string into another. The operations include inserting, deleting, or substituting a character. Essentially, it tells us how many changes we need to make to turn one string into the other. It&apos;s commonly used in fields like spell checking, DNA sequence analysis, and fuzzy string matching. <Anchor href="https://en.wikipedia.org/wiki/Levenshtein_distance" text="Wikipedia" /><br /><br />The higher the percentage, the stricter the algorithm is.
                            </p>}
                            {getIndexByType("Levenshtein") !== -1 && <div className="mt-2">
                                <label htmlFor="lev-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Similarity - {100 - percentageCalculator(getIndexByType("Levenshtein"), 5)}%</label>
                                <input id="lev-range" type="range" value={types[getIndexByType("Levenshtein")].threshold} min={1} max={5} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 rotate-180" onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                    const num: number = parseInt(event.currentTarget.value);
                                    const temp = [...types];
                                    temp[getIndexByType("Levenshtein")].threshold = num;
                                    setTypes(temp);
                                }} />
                            </div>}
                        </div>
                    </div>
                    <div className="flex gap-5 justify-between items-start flex-col sm:flex-row">
                        <div className="flex flex-col gap-2 w-full">
                            {renderPassive()}
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <SubmitButton text="Add" onClick={() => {
                                const obj: PassiveEntry = {
                                    id: uuidv4(),
                                    domain: ""
                                }
                                const temp = [...passive];
                                temp.push(obj);
                                setPassive(temp);
                            }} className="h-full w-full" />
                            <SubmitButton text="Save" onClick={((event: React.FormEvent<HTMLFormElement>) => {
                                // rerollAPIKey();
                                passiveSubmit(event);
                            })} className="h-full w-full sm:w-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}