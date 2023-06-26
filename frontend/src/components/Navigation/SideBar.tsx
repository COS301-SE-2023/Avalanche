import MenuOptions from "@/assets/MenuOptions"
import SideBarItem from "./SidebarItem"
import Link from "next/link"
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, Cog6ToothIcon, Bars4Icon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice";
import { useSelector, useDispatch } from "react-redux";
import { userState, logout } from "@/store/Slices/userSlice";
import { useRouter } from "next/router";
import { getCookie, deleteCookie } from "cookies-next";
import LoadingPage from "../Util/Loading";
import ky from "ky";
import { ErrorToast, SuccessToast } from "../Util";

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
        if (localStorage.get("invite")) {
            const ls: any = localStorage.getItem("invite");
            const key = ls.key;
            const type = ls.type;
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
                        <div className="relative overflow-y-auto py-5 px-3 h-full border-r border-gray-200 bg-gray-200 dark:bg-primaryBackground dark:border-secondaryBackground z-999">
                            <ul className="space-y-2">
                                {
                                    MenuOptions.items.map((option, index) => {
                                        return <SideBarItem text={option.text} icon={option.icon} page={option.page} key={index} />
                                    })
                                }
                            </ul>
                            <ul className="pt-5 mt-5 space-y-2 border-t border-gray-400 dark:border-gray-700">
                                <li>
                                    <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-lightHover dark:hover:bg-gray-700 dark:text-white group">
                                        <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"></path></svg>
                                        <span className="ml-3">Help</span>
                                    </a>
                                </li>
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

            </>
        )
}