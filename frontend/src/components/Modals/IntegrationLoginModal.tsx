import { IIntergrationLoginData as IData } from "@/interfaces";
import { Input, InputLabel, SubmitButton, AlternativeButton, ErrorToast, SuccessToast } from "../Util";
import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import 'animate.css';
import { ModalWrapper } from "./ModalOptions";
import ky, { HTTPError } from "ky";
import { getCookie } from "cookies-next";

interface IIntegrationLoginModal {

}

export default function IntegrationLoginModal({ }: IIntegrationLoginModal) {

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
    const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);

        // user-management/integrateWithWExternalAPI

        try {
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/integrateUserWithWExternalAPI`, {
                timeout: false,
                json: {
                    type: integration.name,
                    allocateToName: email,
                    username: email,
                    password: password,
                    personal: true
                },
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json();
            SuccessToast({ text: "Successfully added integration." })
        } catch (e) {
            let error = e as HTTPError;
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                return ErrorToast({ text: errorJson.message });
            }
        }

    }


    /**
     * This function renders the html to the DOM.
     */
    return (
        <ModalWrapper title="Add a new Data Product">


            {/* Modal Content */}
            <AlternativeButton text={valid ? integration.name : 'Select Provider'} onClick={() => {
                setDropdown(!dropdown);
            }} icon={dropdown ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />} className="w-full gap-2 flex justify-center" />

            {dropdown && <div id="dropdown" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 w-full">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <li>
                        <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white flex gap-3 items-center cursor-pointer" onClick={() => {
                            setIntegration({ name: "ZACR", image: "https://registry.net.za/favicon.ico" });
                            setValid(true);
                            setDropdown(false);
                        }}><img className="h-6" src="https://registry.net.za/favicon.ico" /> ZACR | Registrary Operator for ZA</span>
                    </li>
                </ul>
            </div>}

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