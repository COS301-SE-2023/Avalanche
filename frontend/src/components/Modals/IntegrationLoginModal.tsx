import { IIntergrationLoginData as IData } from "@/interfaces";
import { Input, InputLabel, SubmitButton, AlternativeButton, ErrorToast } from "../Util";
import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from "@heroicons/react/24/solid";
import toast from 'react-hot-toast';
import 'animate.css';
import { ModalHeader, ModalWrapper } from "./ModalOptions";

interface IIntegrationLoginModal {
    handleModal: any,
}

export default function IntegrationLoginModal({ handleModal }: IIntegrationLoginModal) {

    /**
     * This state variable handles whether the dropdown for selecting the integration should be open for closed.
     */
    const [dropdown, setDropdown] = useState<boolean>(false);

    /**
     * This state variable holds the integration data.
     */
    const [integration, setIntegration] = useState<IData>({ name: "", image: "" });

    /**
     * This state variable holds whether the integration has been selected and is valid.
     */
    const [valid, setValid] = useState<boolean>(false);

    /**
     * This state variable just holds whether there is currently something loading or not.
     */
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * This state variable holds the email from the form.
     */
    const [email, setEmail] = useState<string>("");

    /**
     * This state variable holds the password from the form.
     */
    const [password, setPassword] = useState<string>("");

    /**
     * Contains the logic to handle the form onSubmit event
     * This should call Redux to call the backend to do its logic
     * @param event is the event from the forms onSubmit action
     */
    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        setLoading(true);
        ErrorToast({ text: "Nothing is implemented yet. Un-loading in 3 seconds." });
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }

    /**
     * This function renders the html to the DOM.
     */
    return (
        <ModalWrapper handle={handleModal}>

            <ModalHeader title="Add a new Integration" handle={handleModal} />

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
                        <Input type="email" name="email" id="email" placeholder="name@company.com" required={true} disabled={loading} value={email} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            setEmail(event.currentTarget.value);
                        }} />
                    </div>
                    <div>
                        <InputLabel htmlFor="password" text="Password" />
                        <Input type="password" placeholder="••••••••" id="password" name="password" required={true} disabled={loading} value={password} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            setPassword(event.currentTarget.value);
                        }} />
                    </div>
                    <SubmitButton text={`Login to ${integration.name}`} onClick={() => { }} className="w-full" loading={loading} />
                </form>
            </>}

        </ModalWrapper>
    )
}