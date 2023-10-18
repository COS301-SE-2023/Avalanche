import { selectModalManagerState, setCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { getLatestOrganisation, getUserGroups, setAddUserGroupSuccess, setCreateGroupSuccess, userState } from "@/store/Slices/userSlice";
import { TrashIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import NoFind from '../CustomSVG/NoFind';
import { ConfirmModal, CreateGroupModal, OrgnizationCreateModal } from '../Modals';
import AddUserToGroup from "../Modals/AddUserToGroup";
import { AlternativeButton, DeleteButton, SubmitButton, TableIconButton, WarningAlert } from "../Util";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

interface IOrganizationSettings {

}

export default function OrganizationSettings({ }: IOrganizationSettings) {

    const modalState = useSelector(selectModalManagerState);
    const stateUser = useSelector(userState);
    const dispatch = useDispatch<any>();

    /**
     * When the component loads, it must fetch the latest organisation object and the latest user groups
     */
    useEffect(() => {
        dispatch(getLatestOrganisation({}));
        dispatch(getUserGroups({}))
    }, [])

    /**
     * This state variable holds the current active user group tab.
     */
    const [groupTab, setGroupTab] = useState<string>("");

    /**
     * This state variable holds all the users
     */
    const [users, setUsers] = useState<any>([]);

    /**
     * This state variable holds the temp users that are used in the search.
     */
    const [tempUsers, setTempUsers] = useState(users);

    /**
     * Store the current active group index in the array
     */
    const [activeGroupIndex, setactiveGroupIndex] = useState<number>(-1);

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
            t = t.filter((user: any) => user.name.toLowerCase().includes(value.toLowerCase()));
            setTempUsers(t);
        }
    }

    /**
     * This variable holds the className name options htmlFor the two states of the tab navigation elements.
     * active refers to the active tab while inactive refers to the inactive tabs (tabs that are not selected).
     */
    const tabOptions = {
        active: "inline-block px-4 py-3 text-white bg-avalancheBlue dark:bg-blue-600 rounded-lg active w-full flex items-center gap-2",
        inactive: "inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white w-full flex items-center gap-2"
    }

    const renderGroups = () => {

        if (stateUser.userGroups) {
            return stateUser.userGroups.map((data: any, index: number) => {
                const name = `${data.userGroupName}-${data.userGroupID}`;
                const displayName = data.userGroupName.startsWith("admin-") ? "Administrators" : data.userGroupName;
                return <li className="mr-2 cursor-pointer w-full" onClick={() => tabClick(name, index)} key={index}>
                    <span className={groupTab === name ? tabOptions.active : tabOptions.inactive}><span className={`flex w-3 h-3 rounded-full ${isInGroup(data.userGroupID) ? "bg-green-500 dark:bg-green-500" : "bg-gray-900 dark:bg-gray-700"}`} /> {displayName}</span>
                </li>
            })
        }

        return [];
    }

    const isInGroup = (id: number) => {
        let group = null;
        let found = null;

        // Handling finding the group

        group = stateUser.userGroups.find((element: any) => element.userGroupID === id);

        if (!group) return false;

        // Handling checking if the user is in the group

        found = group.groupMembers.find((element: any) => element.email === stateUser.user.email);

        if (found) {
            return true;
        } else {
            return false;
        }
    }

    const isAdmin = () => {
        let found = null;

        found = stateUser.user.userGroups.find((element: any) => element.permission === 1);

        if (found) {
            return true;
        } else {
            return false;
        }

    }

    /**
     * This function handles the tab click.
     * @param value is the value that the group tab state variable will be updated to.
     */
    const tabClick = (value: string, index: number): void => {
        setGroupTab(value);
        setactiveGroupIndex(index);
    }

    return <>
        {stateUser.user.organisation ? <>
            <div className="flex justify-between pb-2 mb-4">
                <h2 className="text-2xl font-medium dark:text-white text-gray-800">{stateUser.user.organisation.name}</h2>
                <>
                    {isAdmin() && false && <DeleteButton text="Delete Organization" onClick={() => { }} />}
                </>

            </div>
            <div className="flex gap-2 flex-col md:flex-row">
                <div className="flex gap-5 mb-1 pb-1 w-48 items-start w-full md:w-auto">
                    <ul className="flex text-sm font-medium text-center pr-2 text-gray-500 dark:text-gray-400 flex-col gap-1 w-full">
                        {renderGroups()}
                    </ul>
                </div>
                <div className="w-full p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <div className="relative overflow-x-auto w-full p-1">
                        <div className="flex items-center justify-between pb-4 w-full">
                            <div className="flex gap-2">
                                {isAdmin() && <AlternativeButton text="Create a Group" onClick={() => {
                                    dispatch(setCreateGroupSuccess(false));
                                    dispatch(setCurrentOpenState("ORG.CreateGroup"));
                                }} className="mb-2" />}
                                {isAdmin() && <AlternativeButton text="Add User to Group" onClick={() => {
                                    dispatch(setAddUserGroupSuccess(false));
                                    dispatch(setCurrentOpenState("ORG.AddUserToGroup"));
                                }} className="mb-2" />}
                            </div>
                            <>
                                {false && <>
                                    <label htmlFor="table-search" className="sr-only">Search</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <input type="text" id="table-search-users" className="block p-2 pl-10 text-sm text-gray-900 border-1.5 border-gray-300 rounded-lg w-80 bg-gray-50 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search for users" onChange={(event: React.FormEvent<HTMLInputElement>) => handleSearch(event)} />
                                    </div>
                                </>}
                            </>
                        </div>

                        { /* Renders users */
                            activeGroupIndex !== -1 && groupTab !== "" && stateUser.userGroups[activeGroupIndex].groupMembers.length > 0 && <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Added
                                        </th>
                                        {isAdmin() && <th scope="col" className="px-6 py-3">

                                        </th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        activeGroupIndex !== -1 && stateUser.userGroups[activeGroupIndex].groupMembers.map((item: any, index: any) => {
                                            return <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900" key={index}>
                                                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                    <img className="w-10 h-10 rounded-full" src="https://github.com/michaelrosstarr.png" alt="Jese image" />
                                                    <div className="pl-3">
                                                        <div className="text-base font-semibold">{item.name}</div>
                                                        <div className="font-normal text-gray-500">{item.email}</div>
                                                    </div>
                                                </th>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        Sometime in the past
                                                    </div>
                                                </td>
                                                {isAdmin() && item.email !== stateUser.user.email && !stateUser?.userGroups[activeGroupIndex]?.groupName?.startsWith("admin-") && <td className="float-right mr-2">
                                                    <TableIconButton icon={<TrashIcon className="h-5 w-5 text-red-500 cursor-pointer" />} colour="red" handleModal={(value) => {
                                                        dispatch(setCurrentOpenState("ORG.RemoveUser"))
                                                    }} />
                                                </td>}
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        }

                        { /* Renders if there is an active tab but there are no users in the group */
                            activeGroupIndex !== -1 && stateUser.userGroups[activeGroupIndex].groupMembers.length === 0 && <div className="flex items-center flex-col gap-2">
                                <NoFind className="h-48 w-48" />
                                <h3 className="text-3xl font-medium text-gray-700 dark:text-white">No user found...</h3>
                                <p className='text-xl text-gray-600 dark:text-gray-400'>No user matching the search criteria exists...</p>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>Data science is 80% preparing data, and 20% complaining about preparing data.</p>
                            </div>
                        }

                        { /* This renders the section if there is no active selected group */
                            !groupTab && <div className="flex items-center flex-col gap-2">
                                <NoFind className="h-48 w-48" />
                                <h3 className="text-3xl font-medium text-gray-700 dark:text-white">No selected group.</h3>
                                <p className='text-xl text-gray-600 dark:text-gray-400'>Be sure to select a group :)</p>
                            </div>
                        }

                    </div>
                </div>
            </div>

        </> : <div className="flex justify-between items-center gap-10 mb-4">
            <WarningAlert title="No Organisation" text='To create an organisation, simply click on the "Add a new organisation" button to get started!' />
            <SubmitButton text="Add a new organization" onClick={() => { dispatch(setCurrentOpenState("ORG.CreateOrg")) }} />
        </div>
        }

        {modalState.currentOpen === "ORG.RemoveUser" && <ConfirmModal text="Are you sure you want to remove this user from this group?" title="Remove User from group" buttonSuccess="Yes, remove user" buttonCancel="No, cancel" />}
        {modalState.currentOpen === "ORG.AddUserToGroup" && <AddUserToGroup />}

        {modalState.currentOpen === "ORG.CreateGroup" && <CreateGroupModal />}

        {modalState.currentOpen === "ORG.CreateOrg" && <OrgnizationCreateModal />}
    </>
}
