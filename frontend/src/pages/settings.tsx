import Sidebar from "@/components/Navigation/SideBar"
import Head from "next/head";
import { ChevronDownIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import PageHeader from "@/components/Util/PageHeader";
import { IntegrationLoginModal, APIKeyCreateModal, OrgnizationCreateModal } from "@/components/Modals";
import { AlternativeButton, DeleteButton, SubmitButton, WarningAlert } from "@/components/Util";
import toast, { Toaster } from 'react-hot-toast';

export default function Settings() {
    /**
     * This is just calling the NextJS router so we can reference it later on in the code
     */
    const router = useRouter();

    /**
     * This variable holds the className name options htmlFor the two states of the tab navigation elements.
     * active refers to the active tab while inactive refers to the inactive tabs (tabs that are not selected).
     */
    const tabOptions = {
        active: "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-avalancheBlue dark:border-avalancheBlue",
        inactive: "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
    }

    const [demo, setDemo] = useState<boolean>(false);

    /**
     * This state variable holds the current active tab.
     */
    const [tab, setTab] = useState<string>("general");

    /**
     * This state variable holds whether the new integration modal should be open or not.
     */
    const [iMOpen, setIMOpen] = useState<boolean>(false);

    /**
     * This state variable holds whether the new organization modal should be open or not.
     */
    const [nOOpen, setNOOpen] = useState<boolean>(false);

    /**
     * This state variable holds whether the new api key modal should be open or not.
     */
    const [apiOpen, setAPIOpen] = useState<boolean>(false);

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
     * Renders out the HTML
     */
    return <>
        <Toaster />
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
                    </div>
                </div>
            </div>

            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-5 flex justify-between">
                <ul className="flex lg:flex-wrap sm:flex-nowrap whitespace-nowrap overflow-x-scroll lg:overflow-x-hidden -mb-px">
                    <li className="mr-2" onClick={(e) => tabClick(e, "general")}>
                        <a href="?tab=general" className={tab === "general" ? tabOptions.active : tabOptions.inactive}>General Settings</a>
                    </li>
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
                <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 m-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 float-right" onClick={() => {
                    setDemo(!demo);
                    toast(`Demo mode: ${!demo ? 'on' : 'off'}`,
                        {
                            icon: '💀',
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            },
                        }
                    );
                }}>Demo Toggle</button>
            </div>

            {tab === "general" && <>
                <WarningAlert title="Cannot Create!" text="Nothing to see here" />
            </>}
            {tab === "organizations" && <>
                {demo ? <h2 className="text-2xl font-medium">Groups</h2> : <div className="flex justify-between items-center gap-10 mb-4">
                    <WarningAlert title="Cannot Create!" text="Organizations are created automatically htmlFor you when you setup an integration." />
                    <SubmitButton text="Add a new organization" onClick={() => setNOOpen(true)} />
                </div>}
            </>}
            {tab === "integrations" && <>
                <div className="flex justify-between items-center gap-10 mb-4">
                    <WarningAlert title="No Integrations." text="You don't have any integrations setup." />
                    <SubmitButton text="Add a new integration" onClick={() => setIMOpen(true)} />
                </div>
            </>}
            {tab === "apikeys" && <>
                {demo ?
                    <>
                        <AlternativeButton text="Actions" onClick={() => { }} icon={<ChevronDownIcon className="h-5 w-5" />} className="flex gap-2 mb-4" />
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="p-4">
                                            <div className="flex items-center">
                                                <input id="checkbox-all" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            API Key Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Created
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        [
                                            { name: "Michael Domain Key", description: "Used to access the API for Michael's Domains", created: "Wednesday, 17 May 23, 21:33:25 SAST" },
                                            { name: "Discord Bot", description: "Used for my discord bot so i can pull", created: "Wednesday, 17 May 23, 21:33:25 SAST" }
                                        ].map((item, index) => {
                                            return <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                                <td className="w-4 p-4">
                                                    <div className="flex items-center">
                                                        <input id="checkbox-table-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                        <label htmlFor="checkbox-table-1" className="sr-only">checkbox</label>
                                                    </div>
                                                </td>
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {item.name}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {item.description}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.created}
                                                </td>
                                                <td className="px-6 py-4 flex gap-3">
                                                    <AlternativeButton text="Roll Key" onClick={() => { }} />
                                                    <DeleteButton text="Delete Key" onClick={() => { }} />
                                                </td>
                                            </tr>
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                    </> : <div className="flex justify-between items-center gap-10 mb-4">
                        <WarningAlert title="No API Keys." text="You dont have any API keys." />
                        <SubmitButton text="Create an API Key" onClick={() => setAPIOpen(true)} />
                    </div>}

            </>}
        </div>

        {/* Models go here */}
        {iMOpen && <IntegrationLoginModal handleModal={(event: React.FormEvent<HTMLFormElement>, value: boolean) => {
            setIMOpen(value);
        }} />}
        {apiOpen && <APIKeyCreateModal handleModal={(event: React.FormEvent<HTMLFormElement>, value: boolean) => {
            setAPIOpen(value);
        }} />}
        {nOOpen && <OrgnizationCreateModal handleModal={(event: React.FormEvent<HTMLFormElement>, value: boolean) => {
            setNOOpen(value);
        }} />}

    </>
}