import { useState } from 'react';
import { Input, InputLabel, SubmitButton, ErrorToast } from '../Util';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface IOrgnizationCreateModal {
    handleModal: any
}

export default function OrgnizationCreateModal({ handleModal }: IOrgnizationCreateModal) {

    /**
     * this variable is for the length of the name of the organization. It defines the maximum length the name can be.
     */
    const nameLength = 30;

    /**
     * This state variable is used to store the name of the organization.
     */
    const [name, setName] = useState<string>("");

    /**
     * This state variable is used to tell if there is loading of some sort going on.
     */
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * This function handles the form submission.
     * @param event is the event that is triggered by the form.
     */
    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {

        event.preventDefault();

        if (!name) {
            ErrorToast({ text: "Invalid organization name. Please provide a valid one." });
        } else if (name.length > nameLength) {
            ErrorToast({ text: "Organization name is too long. Please shorten it. " });
        } else {
            setLoading(true);
            ErrorToast({ text: "Nothing is implemented yet. Un-loading in 3 seconds." });
            setTimeout(() => {
                setLoading(false);
            }, 3000);
        }

    }

    /**
     * This return renders out the HTML for the modal.
     */
    return (
        <div id="authentication-modal" tabIndex={-1} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full h-screen flex justify-center items-center bg-slate-900/50" onClick={(event) => handleModal(event, false)}>
            <div className="relative w-full max-w-md max-h-full" onClick={(event) => event.stopPropagation()}>
                <div className="relative bg-white rounded-lg shadow dark:bg-primaryBackground px-6 py-6 lg:px-8">

                    {/* Modal Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create a new Organization</h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal" onClick={(event) => handleModal(event, false)}>
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <form className="space-y-6" onSubmit={(event) => formSubmit(event)}>
                        <div>
                            <InputLabel htmlFor="name" text="Orgnization Name" />
                            <Input type="text" name="name" id="name" placeholder="Michael's Domains" required={true} disabled={loading} value={name} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                setName(event.currentTarget.value);
                            }} maxLength={nameLength} />
                        </div>
                        <SubmitButton text="Create orgnization" onClick={(event: React.FormEvent<HTMLFormElement>) => {
                            formSubmit(event);
                        }} className="w-full" loading={loading} />
                    </form>
                </div>
            </div>
        </div>
    )
}