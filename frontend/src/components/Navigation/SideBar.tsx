import MenuOptions from "@/assets/MenuOptions"
import SideBarItem from "./SidebarItem"
import Link from "next/link"
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, Cog6ToothIcon, Bars4Icon, ArrowLeftOnRectangleIcon, PencilIcon } from "@heroicons/react/24/solid";
import { selectModalManagerState, setCurrentOpenState } from "@/store/Slices/modalManagerSlice";
import { useSelector, useDispatch } from "react-redux";
import { userState, logout } from "@/store/Slices/userSlice";
import { useRouter } from "next/router";
import { getCookie, deleteCookie } from "cookies-next";
import LoadingPage from "../Util/Loading";
import ky from "ky";
import { ErrorToast, SubmitButton, SuccessToast } from "../Util";
import CreateDashboardModal from "../Modals/CreateDashboardModal";
import { Transition } from '@headlessui/react'

export default function Sidebar() {
    const { theme, setTheme } = useTheme();
    const [menu, setMenu] = useState<boolean>(false);
    const stateUser = useSelector(userState);
    const dispatch = useDispatch();
    const modalState = useSelector(selectModalManagerState);
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
    const clearingData = () => {
        localStorage.removeItem("persist:nextjs");
        deleteCookie("jwt");
        router.push("/");
    }

    /**
     * Handles if the user is not logged in, or the jwt token does not exist
     */
    useEffect(() => {
        if (!stateUser.user.id || !jwt) {
            clearingData();
        }
    }, [stateUser]);

    /**
     * Handles dark and light mode toggles
     */
    const toggleDarkMode = (): void => {
        theme === "dark" ? setTheme('light') : setTheme("dark")
    }

    if (!getCookie("jwt")) {
        clearingData();
        return <LoadingPage />
    } else
        return (
            <>
                <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className={`fixed top-2 right-2 z-20 inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 bg-gray-700 animate__animated ${!modalState.currentOpen ? "animate__fadeIn animate__faster" : "hidden animate__fadeOut animate__faster"}`} onClick={() => setMenu(true)}>
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
                            <Transition
                                show={true}
                                enter="transition-opacity duration-75"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <ul className="space-y-2">
                                    {
                                        MenuOptions.items.map((option, index) => {
                                            return <SideBarItem text={option.text} icon={option.icon} page={option.page} key={index} />
                                        })
                                    }
                                </ul>
                            </Transition>
                            {/* bottom list */}
                            <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-700 dark:border-gray-700 flex flex-col gap-2">
                                <li>
                                    <SideBarItem text="Create a Dashboard" icon={<PencilIcon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />} page="/custom/create" />
                                </li>
                                <ul className="overflow-y-scroll overflow-x-hidden flex-auto">
                                    {
                                        stateUser.user?.dashboards?.map((option: any, index: number) => {
                                            return <SideBarItem text={option.name} icon={<PencilIcon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />} page={`custom/${option.dashboardID}`} key={index} />
                                        })
                                    }
                                </ul>
                            </ul>
                        </div>
                        <div className="absolute bottom-0 left-0 justify-center p-4 w-full lg:flex flex-col gap-2 bg-gray-200 dark:bg-primaryBackground z-20 border-r border-gray-200 dark:border-secondaryBackground">
                            <div>
                                <div className="flex items-center space-x-4">
                                    <img className="w-10 h-10 rounded-full" src="https://github.com/michaelrosstarr.png" alt="" />
                                    <div className="font-medium dark:text-white text-black">
                                        <div>{stateUser.user.firstName} {stateUser.user.lastName}</div>
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
                                <button type="button" className="inline-flex justify-center p-2 text-black rounded cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => dispatch(logout())}>
                                    <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                                    <span className="sr-only">Logout</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
                {modalState.currentOpen === "GRAPH.CreateDashboard" && <CreateDashboardModal />}
            </>
        )
}