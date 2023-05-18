import { useState } from "react";
import { ChevronDownIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { AlternativeButton, SubmitButton, TableIconButton, WarningAlert } from "../Util";
import { ConfirmModal } from "../Modals";

// Redux Stuff
import { selectModalManagerState, setAnimateManagerState } from '@/store/modalManagerSlice';
import { useDispatch, useSelector } from 'react-redux';

interface IAPI {
    demo?: boolean,
    openModal?: any
}

export default function API({ demo, openModal }: IAPI) {

    const modalManager = useSelector(selectModalManagerState);
    const dispatch = useDispatch();

    /**
     * This state variable is used whenever the delete modal is needed, to see if it is opened or closed
     */
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<boolean>(false);

    const [rollConfirmModal, setRollConfirmModal] = useState<boolean>(false);

    return <>{
        demo ?
            <>
                <AlternativeButton text="Actions" onClick={() => { }} icon={<ChevronDownIcon className="h-5 w-5" />} className="flex gap-2 mb-4" />
                <div className="relative overflow-x-auto shadow-md rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input id="checkbox-all" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    API Key Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Created
                                </th>
                                <th scope="col" className="px-6 py-3">

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                [
                                    { name: "Michael Domain Key", description: "Used to access the API for Michael's Domains", created: "Wednesday, 17 May 23, 21:33:25 SAST" },
                                    { name: "Discord Bot", description: "Used for my discord bot so i can pull", created: "Wednesday, 17 May 23, 21:33:25 SAST" }
                                ].map((item, index) => {
                                    return <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input id="checkbox-table-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor="checkbox-table-1" className="sr-only">checkbox</label>
                                            </div>
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.created}
                                        </td>
                                        <td className="px-6 py-4 flex gap-3 float-right">
                                            <TableIconButton icon={<ArrowPathIcon className="h-5 w-5 text-green-500 cursor-pointer" />} colour="green" handleModal={(value) => {
                                                setRollConfirmModal(value);
                                            }} />
                                            <TableIconButton icon={<TrashIcon className="h-5 w-5 text-red-500 cursor-pointer" />} colour="red" handleModal={(value) => {
                                                setDeleteConfirmModal(value);
                                            }} />
                                        </td>
                                    </tr>
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </> : <div className="flex justify-between items-center gap-10 mb-4">
                <WarningAlert title="No API Keys." text="You dont have any API keys." />
                <SubmitButton text="Create an API Key" onClick={() => openModal(true)} />
            </div>
    }

        {deleteConfirmModal && <div className={`animate__animated ${!modalManager ? "animate__fadeIn" : "animate__fadeOut"}`}><ConfirmModal handleModal={(event: React.FormEvent<HTMLFormElement>, value: boolean) => {
            if (!value) {
                setTimeout(() => {
                    setDeleteConfirmModal(value);
                    dispatch(setAnimateManagerState(false));
                }, 150);
            } else {
                setDeleteConfirmModal(value);
            }
        }} text="Are you sure you want to delete this API key?" title="Delete API Key Confirmation" buttonSuccess="Yes, delete" buttonCancel="No, cancel" /></div>}

        {rollConfirmModal && <div className={`animate__animated ${!modalManager ? "animate__fadeIn" : "animate__fadeOut"}`}><ConfirmModal handleModal={(event: React.FormEvent<HTMLFormElement>, value: boolean) => {
            if (!value) {
                setTimeout(() => {
                    setRollConfirmModal(value);
                    dispatch(setAnimateManagerState(false));
                }, 150);
            } else {
                setRollConfirmModal(value);
            }
        }} text="Are you sure you want to roll this API key?" title="Roll API Key Confirmation" buttonSuccess="Yes, roll!" buttonCancel="No, cancel" /></div>}

    </>
}