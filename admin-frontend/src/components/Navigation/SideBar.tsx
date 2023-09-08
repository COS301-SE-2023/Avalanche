import { MenuOptions, NotDropdown } from "@/assets/MenuOptions"
import SideBarItem from "./SidebarItem"
import Link from "next/link"
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, Cog6ToothIcon, Bars4Icon, ArrowLeftOnRectangleIcon, PencilIcon, HomeIcon, ChevronDownIcon, ChartPieIcon,BoltIcon } from "@heroicons/react/24/solid";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { getCookie, deleteCookie } from "cookies-next";
import LoadingPage from "../Util/Loading";
import ky from "ky";
import { ErrorToast, SubmitButton, SuccessToast } from "../Util";
import CreateDashboardModal from "../Modals/CreateDashboardModal";
import { Transition } from '@headlessui/react'
import { v4 as uuidv4 } from 'uuid';
import md5 from 'md5';

export default function Sidebar() {
    const { theme, setTheme } = useTheme();
    const [menu, setMenu] = useState<boolean>(false);
    const [df, setDF] = useState<boolean>(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const jwt = getCookie("jwt");

    /**
     * Handles the invitation
     */
    useEffect(() => {
        if (localStorage.getItem("invite")) {
            const ls: any = localStorage.getItem("invite");
            const data = JSON.parse(ls);
            const key = data.key;
            const type = data.type;
            if (key && type?.type === "group") {
                handleGroupInvite(key, type);
            }
        }
    }, [])

    /**
     * This will handle the group invites
     * @param key is the key of the invitation
     * @param type is the type of the invitation
     */
    const handleGroupInvite = async (key: string, type: string) => {
        try {
            await ky.post(`http://localho.st:4000/user-management/addUserToUserGroupWithKey`, {
                json: { key: `${key}` },
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).json();
            SuccessToast({ text: "You have been successfully added to a group that you were invited to." });
        } catch (e) {
            if (e instanceof Error) ErrorToast({ text: `${e.message}` });
        }
    }

    /**
     * This clears any data that is used by the application
     */


    /**
     * Handles if the user is not logged in, or the jwt token does not exist
     */

    /**
     * Handles dark and light mode toggles
     */
    const toggleDarkMode = (): void => {
        theme === "dark" ? setTheme('light') : setTheme("dark")
    }

    
        return (
            <>
                <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className={`fixed top-2 right-2 z-20 inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 bg-gray-700 animate__animated`} onClick={() => setMenu(true)}>
                    <Bars4Icon className="h-8 w-8" />
                </button>
                <div onClick={() => {
                    setMenu(false)
                }} className={`${menu && 'max-h-full w-full h-screen bg-slate-900/50 fixed z-50'}`}>
                    <aside id="default-sidebar" className={`fixed top-0 left-0 w-64 h-screen transition-transform ${!menu && '-translate-x-full'} sm:translate-x-0`}
                        onClick={e => {
                            e.stopPropagation()
                        }}
                    >
                        <div className="flex flex-col overflow-y-auto py-5 px-3 h-full border-r border-gray-200 bg-gray-200 dark:bg-primaryBackground dark:border-secondaryBackground">
                            {/* top list */}
                            <ul className="space-y-2">
                                <SideBarItem text="Home" icon={<HomeIcon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />} page="home" />
                                <SideBarItem text="Zeus" icon={<BoltIcon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />} page="zeus" />
                                <SideBarItem text="Hera" icon={<BoltIcon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />} page="hera" />
                            </ul>
                            {/* bottom list */}
                            <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-700 dark:border-gray-700 flex flex-col gap-2">
                                
                            </ul>
                        </div>
                        <div className="absolute bottom-0 left-0 justify-center p-4 w-full lg:flex flex-col gap-2 bg-gray-200 dark:bg-primaryBackground z-20 border-r border-gray-200 dark:border-secondaryBackground">
                            <div>
                                <div className="flex items-center space-x-4">
                                    <div className="font-medium dark:text-white text-black">
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center items-center gap-2">
                                <Link href="/settings" data-tooltip-target="tooltip-settings" className="inline-flex justify-center p-2 text-black rounded cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <Cog6ToothIcon className="w-6 h-6" />
                                </Link>
                                <button type="button" className="inline-flex justify-center p-2 text-black rounded cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => toggleDarkMode()}>
                                    {theme === "dark" ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                                    <span className="sr-only">Theme toggle</span>
                                </button>
                                <button type="button" className="inline-flex justify-center p-2 text-black rounded cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600" >
                                    <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                                    <span className="sr-only">Logout</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </>
        )
}