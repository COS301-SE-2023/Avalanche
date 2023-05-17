import Sidebar from "@/components/Navigation/SideBar"
import Head from "next/head";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import PageHeader from "@/components/Util/PageHeader";
import { IntegrationLoginModal, APIKeyCreateModal, OrgnizationCreateModal } from "@/components/Modals";
import { DangerAlert, SubmitButton, WarningAlert } from "@/components/Util";
import { Toaster } from 'react-hot-toast';

export default function Settings() {
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
    const [nOOpen, setNOOpen] = useState<boolean>(false);
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

            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-5">
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
            </div>
            {tab === "general" && <>
                <WarningAlert title="Cannot Create!" text="Nothing to see here" />
            </>}
            {tab === "organizations" && <>
                <div className="flex justify-between items-center gap-10 mb-4">
                    <WarningAlert title="Cannot Create!" text="Organizations are created automatically for you when you setup an integration." />
                    <SubmitButton text="Add a new organization" onClick={() => setNOOpen(true)} />
                </div>
            </>}
            {tab === "integrations" && <>
                <div className="flex justify-between items-center gap-10 mb-4">
                    <WarningAlert title="No Integrations." text="You don't have any integrations setup." />
                    <SubmitButton text="Add a new integration" onClick={() => setIMOpen(true)} />
                </div>
            </>}
            {tab === "apikeys" && <>
                <div className="flex justify-between items-center gap-10 mb-4">
                    <WarningAlert title="No API Keys." text="You dont have any API keys." />
                    <SubmitButton text="Create an API Key" onClick={() => setAPIOpen(true)} />
                </div>
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
        }} />
        }


    </>
}