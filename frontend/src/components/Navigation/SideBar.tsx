import MenuOptions from "@/assets/MenuOptions"
import SideBarItem from "./SidebarItem"
import Link from "next/link"
import { useEffect, useState, useRef } from "react";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useTheme } from "next-themes";

export default function Sidebar() {
    const { systemTheme, theme, setTheme } = useTheme();
    const [menu, setMenu] = useState<boolean>(false);
    const modalEl = useRef();

    const isDarkMode = (): boolean => {
        return theme === 'dark' ? true : false;
    }

    const toggleDarkMode = (): void => {
        theme === "dark" ? setTheme('light') : setTheme("dark")
    }

    return (
        <>
            <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" onClick={() => setMenu(true)}>
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="default-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${!menu && '-translate-x-full'} sm:translate-x-0`} aria-label="Sidenav">
                <div className="overflow-y-auto py-5 px-3 h-full border-r border-gray-200 bg-gray-50 dark:bg-primaryBackground dark:border-secondaryBackground">
                    <ul className="space-y-2">
                        {
                            MenuOptions.items.map((option, index) => {
                                return <SideBarItem text={option.text} icon={option.icon} page={option.page} key={index} />
                            })
                        }
                    </ul>
                    <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
                        <li>
                            <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clip-rule="evenodd"></path></svg>
                                <span className="ml-3">Help</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full lg:flex flex-col gap-2 bg-white dark:bg-primaryBackground z-20 border-r border-gray-200 dark:border-secondaryBackground">
                    <div>
                        <div className="flex items-center space-x-4">
                            <img className="w-10 h-10 rounded-full" src="https://github.com/michaelrosstarr.png" alt="" />
                            <div className="font-medium dark:text-white text-black">
                                <div>Michael Tarr</div>
                                {/* <div className="text-sm text-gray-500 dark:text-gray-400">Michael's Domains Pty Ltd</div> */}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <Link href="/settings" data-tooltip-target="tooltip-settings" className="inline-flex justify-center p-2 text-black rounded cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>
                        </Link>
                        <div className="p-2 text-gray-500 rounded cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <DarkModeSwitch
                                checked={isDarkMode()}
                                onChange={toggleDarkMode}
                                size={24}
                            />
                        </div>
                    </div>
                </div>
            </aside></>
    )
}