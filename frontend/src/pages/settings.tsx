import Sidebar from "@/components/Navigation/SideBar"
import Head from "next/head";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import PageHeader from "@/components/Util/PageHeader";

export default function Settings() {

    const router = useRouter();

    const tabOptions = {
        active: "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-avalancheBlue dark:border-avalancheBlue",
        inactive: "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
    }

    const [tab, setTab] = useState<string>("general");

    useEffect(() => {
        const paramsList: string[] = ["general", "security", "subusers", "integrations", "apikeys"];
        const p = router.query.tab;
        if (paramsList.includes(p as string)) {
            setTab(p as string);
        } else {
            setTab("general");
        }
    }, [router.query]);

    const tabClick = (event: any, value: string) => {
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

    return <>
        <Head>
            <title>Settings</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-primaryBackground">
            <div className="flex justify-between items-center">
                <PageHeader title="Settings" subtitle="Configure your Avalanche" icon={<Cog6ToothIcon className="h-16 w-16" />} />

                <div className="flex items-center space-x-4">
                    <img className="w-16 h-16 rounded-full" src="https://github.com/michaelrosstarr.png" alt="" />
                    <div className="font-medium dark:text-white">
                        <div>Michael Tarr</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">DNS Business</div>
                    </div>
                </div>

            </div>

            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px">
                    <li className="mr-2" onClick={(e) => tabClick(e, "general")}>
                        <a href="?tab=general" className={tab === "general" ? tabOptions.active : tabOptions.inactive}>General Settings</a>
                    </li>
                    <li className="mr-2" onClick={(e) => tabClick(e, "security")}>
                        <a href="?tab=security" className={tab === "security" ? tabOptions.active : tabOptions.inactive}>Security</a>
                    </li>
                    <li className="mr-2" onClick={(e) => tabClick(e, "subusers")}>
                        <a href="?tab=subusers" className={tab === "subusers" ? tabOptions.active : tabOptions.inactive}>Sub-Users</a>
                    </li>
                    <li className="mr-2" onClick={(e) => tabClick(e, "integrations")}>
                        <a href="?tab=integrations" className={tab === "integrations" ? tabOptions.active : tabOptions.inactive}>Integrations</a>
                    </li>
                    <li className="mr-2" onClick={(e) => tabClick(e, "apikeys")}>
                        <a href="?tab=apikeys" className={tab === "apikeys" ? tabOptions.active : tabOptions.inactive}>API Keys</a>
                    </li>
                </ul>
            </div>
        </div>

    </>
}