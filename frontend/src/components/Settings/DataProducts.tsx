import { useState, useEffect } from "react";
import { AlternativeButton, DeleteButton, ErrorToast, SubmitButton, SuccessToast, TableIconButton, WarningAlert } from "../Util";
import { TrashIcon } from '@heroicons/react/24/solid';
import NoFind from '../CustomSVG/NoFind';
import { ConfirmModal, CreateGroupModal, OrgnizationCreateModal } from '../Modals';
import { selectModalManagerState, setCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { clearError, getLatestOrganisation, userState, getUserGroups, setCreateGroupSuccess, setAddUserGroupSuccess } from "@/store/Slices/userSlice";
import { useDispatch, useSelector } from 'react-redux';
import AddUserToGroup from "../Modals/AddUserToGroup";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

interface IDataProducts {

}

export default function DataProducts({ }: IDataProducts) {

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



    const makeUIBasedOnProducts = () => {
        if (!stateUser.user.products || stateUser.user.products.length==0) {
            return <><WarningAlert title="No Data Products." text="You have not added any Data Products..." />
                <SubmitButton text="Add a new Data Product" onClick={() => dispatch(setCurrentOpenState("INTE.CreateIntegration"))} /></>
        }else{
            return <><table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Data Product
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Permission Level
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    stateUser.user.products.map((item: any, index: any) => {
                        return <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900" key={index}>
                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                <div className="pl-3">
                                    <div className="text-base font-semibold">{item.dataSource}</div>
                                </div>
                            </th>
                            <td className="px-6 py-4">
                                <div className="text-base font-semibold">{item.tou}</div>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
        <div className="content-start">
        <SubmitButton  text="Add a new Data Product" onClick={() => dispatch(setCurrentOpenState("INTE.CreateIntegration"))} />
        </div>
        </>
        }
    }

    return <>
        <div className="flex justify-between  items-start gap-10 mb-4">
            {makeUIBasedOnProducts()}

        </div>
    </>
}