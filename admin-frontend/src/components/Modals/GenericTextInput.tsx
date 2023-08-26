import { useState, useEffect } from 'react';
import { SubmitButton, ErrorToast, InputLabel, Input, SuccessToast } from '../Util';
import { ModalWrapper } from './ModalOptions';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { ICreateUserGroupRequest } from '@/interfaces/requests';

interface IGenericTextInput {
    title:string,
    fieldHeading:string,
    placeHolder:string,
    buttonText:string
}

export default function GenericTextInput({title,fieldHeading,placeHolder,buttonText}:IGenericTextInput) {

    const dispatch = useDispatch<any>();


    /**
     * Boolean for if something is loading in the component.
     */
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * these two variables are the fields from the form.
     */
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    /**
     * These two variables are for error checking.
     */
    const [nameError, setNameError] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<boolean>(false);

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    /**
     * This function handles the form submit.
     * @param event is the event triggered by the form
     */
    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        let error = [];

        if (!name) {
            error.push("User group name is missing.");
            setNameError(true);
        }

        if (!email) {
            error.push("Email is missing.");
            setEmailError(true);
        }

        if (!emailRegex.test(email)) {
            error.push("The provided email is not an email.");
        }

        if (error.length > 0) {
            ErrorToast({ text: error.join("\n") });
            return;
        };

        setLoading(true);

        const data = {
            userGroupName: name,
            userEmail: email
        }

    }

    /**
     * This function renders the component to the DOM
     */
    return (
        <ModalWrapper title={title}>
            <form className="space-y-6" onSubmit={(event) => formSubmit(event)}>
                <>
                    <InputLabel htmlFor="name" text={fieldHeading} />
                    <Input type="text" name="name" id="name" placeholder={placeHolder} required={true} disabled={loading} value={name} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        nameError && setNameError(false);
                        setName(event.currentTarget.value);
                    }} maxLength={40} error={nameError} />
                </>
                <SubmitButton text={buttonText}onClick={(event: React.FormEvent<HTMLFormElement>) => {
                    formSubmit(event);
                }} className="w-full" loading={loading} />
            </form>
        </ModalWrapper>
    )
}