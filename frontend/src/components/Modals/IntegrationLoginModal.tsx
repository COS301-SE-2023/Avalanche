import { IIntergrationLoginData as IData } from "@/interfaces";
import { Input, InputLabel, SubmitButton, AlternativeButton } from "../Util";
import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from "@heroicons/react/24/solid";
import toast from 'react-hot-toast';
import 'animate.css';

interface IIntegrationLoginModal {
    handleModal: any,
}

export default function IntegrationLoginModal({ handleModal }: IIntegrationLoginModal) {

    const [dropdown, setDropdown] = useState<boolean>(false);
    const [integration, setIntegration] = useState<IData>({ name: "", image: "" });
    const [valid, setValid] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Contains the logic to handle the form onSubmit event
     * This should call Redux to call the backend to do its logic
     * @param event is the event from the forms onSubmit action
     */
    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        setLoading(true);
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate__animated animate__fadeInDown' : 'animate__animated animate__fadeOutUp'
                } max-w-md`}>
                <div id="toast-warning" className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                        <span className="sr-only">Warning icon</span>
                    </div>
                    <div className="ml-3 text-sm font-normal">Nothing is implemented yet. Un-loading in 3 seconds.</div>
                    <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-warning" aria-label="Close" onClick={() => toast.dismiss(t.id)}>
                        <span className="sr-only">Close</span>
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
            </div>
        ))
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }

    return (
        <div id="authentication-modal" tabIndex={-1} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full h-screen flex justify-center items-center bg-slate-900/50" onClick={(event) => handleModal(event, false)}>
            <div className="relative w-full max-w-md max-h-full" onClick={e => e.stopPropagation()}>
                <div className="relative bg-white rounded-lg shadow dark:bg-primaryBackground px-6 py-6 lg:px-8">

                    {/* Modal Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add a new Integration</h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal" onClick={(event) => handleModal(event, false)}>
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="mb-4">
                        <AlternativeButton text={valid ? integration.name : 'Select Provider'} onClick={() => {
                            setDropdown(!dropdown);
                        }} icon={dropdown ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />} className="w-full gap-2 flex justify-center" />

                        {dropdown && <div id="dropdown" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 w-full">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white flex gap-3 items-center cursor-pointer" onClick={() => {
                                        setIntegration({ name: "ZARC", image: "https://registry.net.za/favicon.ico" });
                                        setValid(true);
                                        setDropdown(false);
                                    }}><img className="h-6" src="https://registry.net.za/favicon.ico" /> ZARC | Registrary Operator for ZA</span>
                                </li>
                            </ul>
                        </div>}

                    </div>
                    {valid && <><p className="text-grey-900 dark:text-white text-center mb-4">Please use your {integration.name} credentials to add this integration.</p>
                        <form className="space-y-6" onSubmit={(e) => formSubmit(e)}>
                            <div>
                                <InputLabel htmlFor="email" text="Your email" />
                                <Input type="email" name="email" id="email" placeholder="name@company.com" required={true} disabled={loading} />
                            </div>
                            <div>
                                <InputLabel htmlFor="password" text="Password" />
                                <Input type="password" placeholder="••••••••" id="password" name="password" required={true} disabled={loading} />
                            </div>
                            <SubmitButton text={`Login to ${integration.name}`} onClick={() => { }} className="w-full" loading={loading} />
                        </form>
                    </>}

                </div>
            </div>
        </div>
    )
}