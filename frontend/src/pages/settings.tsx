import Sidebar from "@/components/Navigation/SideBar"
import Head from "next/head";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import PageHeader from "@/components/Util/PageHeader";
import { IntegrationLoginModal } from "@/components/Modals";
import { SubmitButton, WarningAlert, MainContent } from "@/components/Util";
import { Toaster } from 'react-hot-toast';
import OrganizationSettings from "@/components/Settings/Organizations";
import { userState } from "@/store/Slices/userSlice";
import { selectModalManagerState, setCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { useDispatch, useSelector } from 'react-redux';
import GeneralSettings from "@/components/Settings/General";
import DataProducts from "@/components/Settings/DataProducts";
import introJs from 'intro.js';
import 'intro.js/introjs.css';
//import 'intro.js/themes/introjs-modern.css';

export default function Settings() {

    const modalState = useSelector(selectModalManagerState);
    const user = useSelector(userState);

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


    /**
     * This state variable holds the current active tab.
     */
    const [tab, setTab] = useState<string>("general");


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

    const introJS = introJs();
    const startTut = () => {
        introJS.setOptions({
            steps: [
                {
                    intro: 'Welcome! This tutorial will walk you through integrating with a data product! This means changing your permission level, public is the default level.',
                    title: "Integrate Data Product Tutorial"
                },
                {
                    element: document.getElementsByClassName("text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:focus:ring-primary-800 inline-flex items-center justify-center flex-nowrap hover:bg-primary-700 dark:hover:bg-primary-700 ")[2] as HTMLElement,
                    intro: 'Here you can choose the name you want for your Dashboard.',
                }
            ]
        }).start();

        
        
    }

    /**
     * Renders out the HTML
     */
    return <>
        <Toaster />
        <Head>
            <title>Settings</title>
        </Head>
        <Sidebar />

        <MainContent>
            <div className="flex justify-between items-center">
                <PageHeader title="Settings" subtitle="Configure your Avalanche" icon={<Cog6ToothIcon className="h-16 w-16 text-black dark:text-white" />} />
                <div className="flex items-center space-x-4 hidden lg:flex">
                    <img className="w-16 h-16 rounded-full" src="https://github.com/michaelrosstarr.png" alt="" />
                    <div className="font-medium dark:text-white text-black">
                        <div>{user.user.firstName} {user.user.lastName}</div>
                    </div>
                </div>
            </div>

            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-5 flex justify-between">
                <ul className="flex lg:flex-wrap sm:flex-nowrap whitespace-nowrap overflow-x-scroll lg:overflow-x-hidden -mb-px">
                    <li className="mr-2" onClick={(e) => tabClick(e, "general")}>
                        <a href="?tab=general" className={tab === "general" ? tabOptions.active : tabOptions.inactive}>General Settings</a>
                    </li>
                    <li className="mr-2" onClick={(e) => tabClick(e, "organizations")}>
                        <a href="?tab=organizations" className={tab === "organizations" ? tabOptions.active : tabOptions.inactive}>Organizations</a>
                    </li>
                    <li className="mr-2" onClick={(e) => tabClick(e, "integrations")}>
                        <a href="?tab=integrations" className={tab === "integrations" ? tabOptions.active : tabOptions.inactive}>Data Products</a>

                    </li>
                </ul>
            </div>

            {tab === "general" && <>
                <GeneralSettings user={user} />
            </>}
            {tab === "organizations" &&
                <OrganizationSettings />
            }
            {tab === "integrations" && <>
                <DataProducts></DataProducts>
                <SubmitButton text="Start tutorial" className="flex-auto" onClick={() => {
                        startTut();
                    }} />
            </>}
        </MainContent>

        {/* Models go here */}
        {modalState.currentOpen === "INTE.CreateIntegration" && <IntegrationLoginModal />}

    </>
}
