import { IDataSourceItem, MenuOptions, NotDropdown, dataSourceDescriptors, dataSourceName } from "@/assets/MenuOptions"
import SideBarItem from "./SidebarItem"
import Link from "next/link"
import { useState, useEffect, useRef, Fragment } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, Cog6ToothIcon, Bars4Icon, ArrowLeftOnRectangleIcon, PencilIcon, HomeIcon, ChevronDownIcon, ChartPieIcon, ChevronRightIcon, GlobeAltIcon, ServerStackIcon } from "@heroicons/react/24/solid";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice";
import { useSelector, useDispatch } from "react-redux";
import { userState, logout } from "@/store/Slices/userSlice";
import { graphState, selectDataSource } from "@/store/Slices/graphSlice";
import { permissionState, getEndpoints, IPermission } from "@/store/Slices/permissionSlice";
import { useRouter } from "next/router";
import { getCookie, deleteCookie } from "cookies-next";
import LoadingPage from "../Util/Loading";
import ky from "ky";
import { BetterDropdown, ErrorToast, SubmitButton, SuccessToast } from "../Util";
import CreateDashboardModal from "../Modals/CreateDashboardModal";
import { Transition, Popover } from '@headlessui/react'
import { v4 as uuidv4 } from 'uuid';
import md5 from 'md5';

export default function Sidebar() {
    const { theme, setTheme } = useTheme();
    const [menu, setMenu] = useState<boolean>(false);
    const [df, setDF] = useState<boolean>(false);
    const stateUser = useSelector(userState);
    const stateGraph = useSelector(graphState);
    const statePermissions = useSelector(permissionState);
    const dispatch = useDispatch<any>();
    const modalState = useSelector(selectModalManagerState);
    const router = useRouter();
    const initialSelectedDataSource = useRef(stateGraph.selectedDataSource);

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
        dispatch(getEndpoints());
    }, [])

    useEffect(() => {
        if (statePermissions.endpointResolution == "Retry") {
            dispatch(getEndpoints());
        }
    }, [statePermissions.endpointResolution])

    /**
     * This will handle the group invites
     * @param key is the key of the invitation
     * @param type is the type of the invitation
     */
    const handleGroupInvite = async (key: string, type: string) => {
        try {
            await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/addUserToUserGroupWithKey`, {
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
     * Handles if the data source changes
     * When the data source changes the current window should be reloaded to reflect data from the selected source
     */
    useEffect(() => {
        if (initialSelectedDataSource.current !== stateGraph.selectedDataSource) {
            initialSelectedDataSource.current = stateGraph.selectedDataSource;
        }
    }, [stateGraph.selectedDataSource]);

    /**
     * Handles dark and light mode toggles
     */
    const toggleDarkMode = (): void => {
        theme === "dark" ? setTheme('light') : setTheme("dark")
    }

    /**
     * Changes the selected Data source in the slice
     * @param dataSource 
     */
    const reduceDataSource = (dataSource?: string) => {
        dispatch(selectDataSource(dataSource));
    }

    if (!getCookie("jwt")) {
        clearingData();
        return <LoadingPage />
    } else
        return (
            <>
                <button className={`fixed top-2 right-2 z-20 inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 bg-gray-700 animate__animated ${!modalState.currentOpen ? "animate__fadeIn animate__faster" : "hidden animate__fadeOut animate__faster"}`} onClick={() => setMenu(true)}>
                    <Bars4Icon className="h-8 w-8" />
                </button>
                <div onClick={() => {
                    setMenu(false)
                }} className={`${menu && 'max-h-full w-full h-screen bg-slate-900/50 fixed z-50'}`}>
                    <aside id="default-sidebar" className={`fixed top-0 left-0 w-64 h-screen transition-transform ${!menu && '-translate-x-full'} sm:translate-x-0 flex flex-col`}
                        onClick={e => {
                            e.stopPropagation()
                        }}
                    >
                        <div className="flex flex-col overflow-y-auto py-5 px-3 h-full border-r border-gray-200 bg-gray-200 dark:bg-dark-background dark:border-dark-background">
                            {/* top list */}
                            <ul className="space-y-2">
                                <SideBarItem text="Home" icon={<HomeIcon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />} page="home" />
                                <li>
                                    <span className="flex items-center justify-between p-2 text-gray-900 rounded-lg dark:text-white hover:bg-lightHover dark:hover:bg-gray-700 hover:cursor-pointer" onClick={() => setDF(!df)}>
                                        <div className="flex">
                                            <ChartPieIcon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                            <span className="ml-3">Dashboards</span>
                                        </div>
                                        <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white ${df && "rotate-180"}`} />
                                    </span>
                                </li>
                                <Transition
                                    show={df}
                                    enter="transition-opacity duration-200"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition-opacity duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="ml-5">
                                        {
                                            MenuOptions.items.map((option: any, index: number) => {
                                                const statePermissionsArr = statePermissions.permissions.find((element: any) => { return element.dataSource == stateGraph.selectedDataSource });
                                                if (statePermissionsArr && statePermissionsArr.endpoints.includes(option.endpoint)) {
                                                    return <SideBarItem text={option.text} icon={option.icon} page={option.page} key={index} />
                                                }
                                            })
                                        }
                                    </div>
                                </Transition>
                                {
                                    NotDropdown.items.map((option: any, index: number) => {
                                        return <SideBarItem text={option.text} icon={option.icon} page={option.page} key={index} />
                                    })
                                }
                            </ul>
                            {/* bottom list */}
                            <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-700 dark:border-gray-700 flex flex-col gap-2">
                                <li>
                                    <SubmitButton text="Create a Dashboard" className="w-full" onClick={() => {
                                        router.push({
                                            pathname: `/custom/${uuidv4()}`
                                        }, undefined, {
                                            shallow: false
                                        })
                                    }} />
                                </li>
                                <ul className="overflow-y-auto overflow-x-hidden flex-auto">
                                    {
                                        stateUser.user?.dashboards?.map((option: any, index: number) => {
                                            return <SideBarItem text={option.name} icon={<PencilIcon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />} page={`custom/${option.dashboardID}`} key={index} />
                                        })
                                    }
                                </ul>

                            </ul>
                        </div>

                        <div className="bottom-0 left-0 justify-center p-4 w-full flex flex-col gap-2 bg-gray-200 dark:bg-dark-background dark:border-dark-background border-r border-gray-200">
                            {(stateUser.user.dataProducts?.length === 0 || !stateUser.user.dataProducts) && <SubmitButton text="Are you a registrar? Integrate" className="w-full" onClick={() => {
                                router.push({
                                    pathname: '/settings',
                                    query: { tab: 'integrations' }
                                })
                            }} />}

                            <BetterDropdown items={[{ name: "ZACR", value: "zacr" }, { name: "Africa", value: "africa" }, { name: "RyCE", value: "ryce" }]} text={"select a warehouse"} option={stateGraph.selectedDataSource} set={reduceDataSource} absolute={true} placement="above" className="sm:hidden" />
                            <Popover className="relative w-full hidden sm:flex">
                                {({ open, close }) => (
                                    <div className="w-full">
                                        <Popover.Button className="bg-gray-50 border-2 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-thirdBackground dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-gray-300 dark:border-thirdBackground flex justify-between">
                                            {dataSourceName.find((i: IDataSourceItem) => stateGraph.selectedDataSource === i.code)?.value}
                                            <ChevronRightIcon className={`ml-1 h-5 w-5 transition duration-125 ${open && "rotate-180"}`} />
                                        </Popover.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-in duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Popover.Panel className="absolute ml-64 w-96 -top-24 rounded bg-primaryBackground p-5 flex gap-4 flex-col">
                                                {
                                                    statePermissions.permissions.map((item: IPermission, index: number) => {
                                                        const name = dataSourceName.find((i: IDataSourceItem) => i.code === item.dataSource);
                                                        const description = dataSourceDescriptors.find((i: IDataSourceItem) => i.code === item.dataSource);
                                                        return <div onClick={() => {
                                                            reduceDataSource(name?.code);
                                                            close();
                                                        }} className="flex items-center gap-4 transition duration-75 hover:-translate-y-1 hover:cursor-pointer" key={index}>
                                                            <div className="bg-avalancheBlue rounded p-2">
                                                                <ServerStackIcon className="w-8 h-8 text-white" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className="text-lg">{name?.value}</p>
                                                                <p>{description?.value}</p>
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </Popover.Panel>
                                        </Transition>
                                    </div>
                                )}
                            </Popover>
                            <div className="flex items-center space-x-4">
                                <img className="w-10 h-10 rounded-full" src={`https://www.gravatar.com/avatar/${md5(stateUser.user.email)}`} alt="" />
                                <div className="font-medium dark:text-white text-black">
                                    <div>{stateUser.user.firstName} {stateUser.user.lastName}</div>
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