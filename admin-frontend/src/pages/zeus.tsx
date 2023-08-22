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
import ZeusMenu from "@/components/Util/Composite/ZeusMenu";
import ZeusEditor from "@/components/Util/Composite/ZeusEditor";
import { selectModalManagerState, setCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import AddUserToGroup from "@/components/Modals/AddUserToGroup";
import GenericTextInput from "@/components/Modals/GenericTextInput";


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
     * This function watched the watchState for the variable to change.
     */
  

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

    const getIndicator = (value: number) => {
        return `bg-indicator-${Math.floor((value / 10) + 1)}`;
    }

    

    const getWhoIS = async (domain: string) => {
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
            
        } catch (e) {
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
            <title>Zeus</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-white dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Zeus" subtitle="" icon={<BoltIcon className="h-16 w-16 text-black dark:text-white" />} />
            </div>
            <div className="grid grid-cols-4 h-full">
                <div className="col-span-3 "> <ZeusEditor/></div>
                <div className="col-span-1"> 
                    <ZeusMenu></ZeusMenu>
                </div>
            </div >
        </div>
        {modalState && modalState.currentOpen === "ZEUS.addDataSource" && <GenericTextInput title="New Data Source"  fieldHeading="Data Source"  placeHolder="Data Source"  buttonText="Add" />}
        {modalState && modalState.currentOpen === "ZEUS.addEndpoint"   && <GenericTextInput title="New Endpoint"     fieldHeading="Endpoint"     placeHolder="Endpoint"     buttonText="Add" />}
        {modalState && modalState.currentOpen === "ZEUS.addTypeOfUser" && <GenericTextInput title="New Type of User" fieldHeading="Type of User" placeHolder="Type of User" buttonText="Add" />}
    </>
}