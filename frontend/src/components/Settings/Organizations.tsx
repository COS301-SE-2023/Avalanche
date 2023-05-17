import { useState } from 'react';
import { AlternativeButton, DeleteButton, SubmitButton, WarningAlert } from "../Util";
import { TrashIcon } from '@heroicons/react/24/solid';
import NoFind from '../CustomSVG/NoFind';
import { DeleteConfirmModal } from '../Modals';

interface IOrganizationSettings {
    demo?: boolean,
    openModal?: any
}

const usersArray = [
    {
        name: "Michael Tarr",
        email: "michael@michael.domains",
        image: "https://github.com/michaelrosstarr.png",
        added: "2023-05-17 08:31:17 SAST"
    },
    {
        name: "Mark Botros",
        email: "mark@michael.domains",
        image: "https://github.com/michaelrosstarr.png",
        added: "2023-05-17 08:31:17 SAST"
    },
    {
        name: "Inge Odendaal",
        email: "inge@michael.domains",
        image: "https://github.com/michaelrosstarr.png",
        added: "2023-05-17 08:31:17 SAST"
    },
    {
        name: "Gilles Teuwen",
        email: "gilles@michael.domains",
        image: "https://github.com/michaelrosstarr.png",
        added: "2023-05-17 08:31:17 SAST"
    },
    {
        name: "Sarah Killian",
        email: "sarah@michael.domains",
        image: "https://github.com/michaelrosstarr.png",
        added: "2023-05-17 08:31:17 SAST"
    }
];

export default function OrganizationSettings({ demo, openModal }: IOrganizationSettings) {

    /**
     * This state variable holds the current active user group tab.
     */
    const [groupTab, setGroupTab] = useState<string>("billing");

    /**
     * This state variable holds all the users
     */
    const [users, setUsers] = useState(usersArray);

    /**
     * This state variable holds the temp users that are used in the search.
     */
    const [tempUsers, setTempUsers] = useState(users);

    /**
     * This state variable is used whenever the delete modal is needed, to see if it is opened or closed
     */
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<boolean>(false);

    /**
     * This function handles the logic for searching for users.
     * @param event is the event from the search input
     */
    const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        if (!value) {
            setTempUsers(users);
        } else {
            let t = users;
            t = t.filter((user) => user.name.toLowerCase().includes(value.toLowerCase()));
            setTempUsers(t);
        }
    }

    /**
     * This variable holds the className name options htmlFor the two states of the tab navigation elements.
     * active refers to the active tab while inactive refers to the inactive tabs (tabs that are not selected).
     */
    const tabOptions = {
        active: "inline-block px-4 py-3 text-white bg-avalancheBlue dark:bg-blue-600 rounded-lg active w-full",
        inactive: "inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white w-full"
    }

    /**
     * This function handles the tab click.
     * @param value is the value that the group tab state variable will be updated to.
     */
    const tabClick = (value: string): void => {
        setGroupTab(value);
    }

    return <>
        {demo ? <>
            <div className="flex justify-between pb-2 mb-4">
                <h2 className="text-2xl font-medium dark:text-white text-gray-800">Michael's Domains</h2>
                <DeleteButton text="Delete Organization" onClick={() => { }} />
            </div>
            <div className="flex gap-2">
                <div className="flex gap-5 mb-1 pb-1 w-48 items-start">
                    <ul className="flex text-sm font-medium text-center pr-2 text-gray-500 dark:text-gray-400 flex-col gap-1 w-full">
                        <AlternativeButton text="Create a Group" onClick={() => { }} className="mb-2" />
                        <li className="mr-2 cursor-pointer w-full" onClick={() => tabClick("billing")} >
                            <span className={groupTab === "billing" ? tabOptions.active : tabOptions.inactive}>Billing Group</span>
                        </li>
                        <li className="mr-2 cursor-pointer w-full" onClick={() => tabClick("sales")}>
                            <span className={groupTab === "sales" ? tabOptions.active : tabOptions.inactive}>Sales Group</span>
                        </li>
                        <li className="mr-2 cursor-pointer w-full" onClick={() => tabClick("owner")}>
                            <span className={groupTab === "owner" ? tabOptions.active : tabOptions.inactive}>Owner Group</span>
                        </li>
                    </ul>
                </div>
                <div className="w-full p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <div className="relative overflow-x-auto w-full p-1">
                        <div className="flex items-center justify-between pb-4 w-full">
                            <div>
                                <button id="dropdownActionButton" data-dropdown-toggle="dropdownAction" className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600" type="button">
                                    <span className="sr-only">Action button</span>
                                    Action
                                    <svg className="w-3 h-3 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                {/* <!-- Dropdown menu --> */}
                                <div id="dropdownAction" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reward</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Promote</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Activate account</a>
                                        </li>
                                    </ul>
                                    <div className="py-1">
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete User</a>
                                    </div>
                                </div>
                            </div>
                            <label htmlFor="table-search" className="sr-only">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                                </div>
                                <input type="text" id="table-search-users" className="block p-2 pl-10 text-sm text-gray-900 border-1.5 border-gray-300 rounded-lg w-80 bg-gray-50 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search for users" onChange={(event: React.FormEvent<HTMLInputElement>) => handleSearch(event)} />
                            </div>
                        </div>
                        {tempUsers.length > 0 ? <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">
                                            <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Added
                                    </th>
                                    <th scope="col" className="px-6 py-3">

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tempUsers.map((item, index) => {
                                        return <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900" key={index}>
                                            <td className="w-4 p-4">
                                                <div className="flex items-center">
                                                    <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                                </div>
                                            </td>
                                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <img className="w-10 h-10 rounded-full" src="https://github.com/michaelrosstarr.png" alt="Jese image" />
                                                <div className="pl-3">
                                                    <div className="text-base font-semibold">{item.name}</div>
                                                    <div className="font-normal text-gray-500">{item.email}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div> {item.added}
                                                </div>
                                            </td>
                                            <td className="float-right mr-2">
                                                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-2 ml-auto inline-flex items-center dark:hover:bg-red-50 dark:hover:text-white dark:hover:border dark:hover:border-red-500" data-modal-hide="authentication-modal" onClick={(event) => {
                                                    setDeleteConfirmModal(true);
                                                }}>
                                                    <TrashIcon className="h-5 w-5 text-red-500 cursor-pointer" />
                                                </button>

                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table> : <div className="flex items-center flex-col gap-2">
                            <NoFind className="h-48 w-48" />
                            <h3 className="text-3xl font-medium text-gray-700 dark:text-white">No user found...</h3>
                            <p className='text-xl text-gray-600 dark:text-gray-400'>No user matching the search criteria exists...</p>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>Data science is 80% preparing data, and 20% complaining about preparing data.</p>
                        </div>}
                    </div>
                </div>
            </div>

        </> : <div className="flex justify-between items-center gap-10 mb-4">
            <WarningAlert title="Cannot Create!" text="Organizations are created automatically htmlFor you when you setup an integration." />
            <SubmitButton text="Add a new organization" onClick={() => openModal(true)} />
        </div>
        }
        {deleteConfirmModal && <DeleteConfirmModal handleModal={(event: React.FormEvent<HTMLFormElement>, value: boolean) => {
            setDeleteConfirmModal(value);
        }} text="Are you sure you want to remove this user from this group?" />}
    </>
}