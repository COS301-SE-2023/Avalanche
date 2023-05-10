import Sidebar from "@/components/Navigation/SideBar"
import Head from "next/head";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import PageHeader from "@/components/Util/PageHeader";
import Link from "next/link";
import { IntegrationLoginModal, } from "@/components/Modals";
import { IIntergrationLoginData as IData } from "@/interfaces"
import { DangerAlert, WarningAlert } from "@/components/Util";
import { useTheme } from "next-themes";

export default function Settings() {
    const { systemTheme, theme, setTheme } = useTheme();

    /**
     * This is just calling the NextJS router so we can reference it later on in the code
     */
    const router = useRouter();

    const tabOptions = {
        active: "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-avalancheBlue dark:border-avalancheBlue",
        inactive: "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
    }

    const [tab, setTab] = useState<string>("general");
    const [iMOpen, setIMOpen] = useState<boolean>(false);
    const [integration, setIntegration] = useState<IData>({ name: "", image: "" });

    /**
     * This is triggered whenever the router.query changes in any way. This is used to handle the displaying of the correct content on the page underneath the tab navigation.
     */
    useEffect((): void => {
        const paramsList: string[] = ["general", "security", "subusers", "integrations", "apikeys", "organizations"];
        const p = router.query.tab;
        if (paramsList.includes(p as string)) {
            setTab(p as string);
        } else {
            setTab("general");
        }
    }, [router.query]);

    /**
     * This should be called on the onClick of a tab list element. It handles the clicking of that specified tab element.
     * @param event is the event triggered by clicking the tab element
     * @param value is a passed in string variable that defines what tab was pressed
     */
    const tabClick = (event: any, value: string): void => {
        event.preventDefault();
        setTab(value);
        router.push(
            {
                pathname: `/settings`,
                query: {
                    tab: value
                }
            },
            `/settings?tab=${value}`,
            { shallow: true }
        );
    };

    /**
     * This handles the opening and closing of the modal
     * @param value is the value that iMOpen should be set to
     * @param data is the data value that integration should be set to
     */
    const handleModal = (value: boolean, data: IData = { name: "", image: "" }): void => {
        setIMOpen(value);
        setIntegration(data);
    }

    /**
     * Renders out the HTML
     */
    return <>
        <Head>
            <title>Settings</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-white dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Settings" subtitle="Configure your Avalanche" icon={<Cog6ToothIcon className="h-16 w-16 text-black dark:text-white" />} />
                <div className="flex items-center space-x-4 hidden lg:flex">
                    <img className="w-16 h-16 rounded-full" src="https://github.com/michaelrosstarr.png" alt="" />
                    <div className="font-medium dark:text-white text-black">
                        <div>Michael Tarr</div>
                        {/* <div className="text-sm text-gray-500 dark:text-gray-400">Michael's Domains Pty Ltd</div> */}
                    </div>
                </div>
            </div>

            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-5">
                <ul className="flex lg:flex-wrap sm:flex-nowrap whitespace-nowrap overflow-x-scroll lg:overflow-x-hidden -mb-px">
                    <li className="mr-2" onClick={(e) => tabClick(e, "general")}>
                        <a href="?tab=general" className={tab === "general" ? tabOptions.active : tabOptions.inactive}>General Settings</a>
                    </li>
                    {/* <li className="mr-2" onClick={(e) => tabClick(e, "security")}>
                        <a href="?tab=security" className={tab === "security" ? tabOptions.active : tabOptions.inactive}>Security</a>
                    </li> */}
                    {/* <li className="mr-2" onClick={(e) => tabClick(e, "subusers")}>
                        <a href="?tab=subusers" className={tab === "subusers" ? tabOptions.active : tabOptions.inactive}>Sub-Users</a>
                    </li> */}
                    <li className="mr-2" onClick={(e) => tabClick(e, "organizations")}>
                        <a href="?tab=subusers" className={tab === "organizations" ? tabOptions.active : tabOptions.inactive}>Organizations</a>
                    </li>
                    <li className="mr-2" onClick={(e) => tabClick(e, "integrations")}>
                        <a href="?tab=integrations" className={tab === "integrations" ? tabOptions.active : tabOptions.inactive}>Integrations</a>
                    </li>
                    <li className="mr-2" onClick={(e) => tabClick(e, "apikeys")}>
                        <a href="?tab=apikeys" className={tab === "apikeys" ? tabOptions.active : tabOptions.inactive}>API Keys</a>
                    </li>
                </ul>
            </div>
            {tab === "general" && <>
                <WarningAlert title="Cannot Create!" text="Nothing to see here" />
            </>}
            {tab === "organizations" && <>
                <WarningAlert title="Cannot Create!" text="Organizations are created automatically for you when you setup an integration." />
            </>}
            {tab === "integrations" && <>
                <div className="m-10 flex flex-col gap-6">
                    <div className="flex justify-between items-center border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 flex-col gap-4 lg:gap-0 lg:flex-row">
                        <div className="flex flex-row items-center gap-4">
                            <img className="h-12" src="https://registry.net.za/favicon.ico" />
                            <p className="text-3xl font-medium text-gray-900 dark:text-white">ZARC | Registry Operator for ZA</p>
                        </div>
                        <div className="mb-4 w-full lg:w-max">
                            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full lg:w-max" onClick={() => handleModal(true, { name: "ZARC", image: "https://registry.net.za/favicon.ico" } as IData)}>Add Integration</button>
                        </div>
                    </div>
                </div>
            </>}
            {tab === "apikeys" && <>
                <WarningAlert title="No API Keys." text="You dont have any API keys." />
                <button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Create an API Key</button>
            </>}
        </div>

        {iMOpen && <IntegrationLoginModal data={integration} handleModal={handleModal} />}


    </>
}