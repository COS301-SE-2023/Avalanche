import MenuOptions from "@/assets/MenuOptions"
import SideBarItem from "./SidebarItem"
import Link from "next/link"
import { useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

export default function Sidebar() {
    const { theme, setTheme } = useTheme();
    const [menu, setMenu] = useState<boolean>(false);

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
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>
            <div onClick={() => {
                setMenu(false)
            }} className={`${menu && 'max-h-full w-full h-screen g-slate-900/50 fixed'}`}>
                <aside id="default-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${!menu && '-translate-x-full'} sm:translate-x-0`} aria-label="Sidenav" onClick={e => {
                    e.stopPropagation()
                }}>
                    <div className="overflow-y-auto py-5 px-3 h-full border-r border-gray-200 bg-gray-200 dark:bg-primaryBackground dark:border-secondaryBackground">
                        <ul className="space-y-2">
                            {
                                MenuOptions.items.map((option, index) => {
                                    return <SideBarItem text={option.text} icon={option.icon} page={option.page} key={index} />
                                })
                            }
                        </ul>
                        <ul className="pt-5 mt-5 space-y-2 border-t border-gray-400 dark:border-gray-700">
                            <li>
                                <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                                    <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"></path></svg>
                                    <span className="ml-3">Help</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full lg:flex flex-col gap-2 bg-gray-200 dark:bg-primaryBackground z-20 border-r border-gray-200 dark:border-secondaryBackground">
                        <div>
                            <div className="flex items-center space-x-4">
                                <img className="w-10 h-10 rounded-full" src="https://github.com/michaelrosstarr.png" alt="" />
                                <div className="font-medium dark:text-white text-black">
                                    <div>Michael Tarr</div>
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
                        </div>
                    </div>
                </aside>
            </div>

        </>
    )
}

{/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
</svg> */}

{/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
</svg> */}

