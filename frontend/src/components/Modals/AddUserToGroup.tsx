import { useState, useEffect } from 'react';
import { SubmitButton, ErrorToast, InputLabel, Input, SuccessToast } from '../Util';
import { ModalWrapper } from './ModalOptions';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { userState, getUserGroups } from '@/store/Slices/userSlice';
import { createOrganisationGroup, addUserToGroup } from '@/store/Slices/userSlice';
import { ICreateUserGroupRequest } from '@/interfaces/requests';

export default function AddUserToGroup() {

    const dispatch = useDispatch<any>();
    const stateUser = useSelector(userState);

    useEffect(() => {
        console.log("bingo");
        if (stateUser.addUserGroupSuccess) {
            dispatch(clearCurrentOpenState())
            SuccessToast({ text: "Successfully sent invitation email." });
        }
    }, [stateUser])

    /**
     * Boolean for if something is loading in the component.
     */
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * these two variables are the fields from the form.
     */
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    /**
     * These two variables are for error checking.
     */
    const [nameError, setNameError] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<boolean>(false);

    /**
     * This function handles the form submit.
     * @param event is the event triggered by the form
     */
    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        let error = "";

        if (!name) {
            error += "The group is missing a name.\n";
            setNameError(true);
        }

        if (!email) {
            error += "The group is missing a description.";
            setEmailError(true);
        }

        if (nameError || emailError) {
            ErrorToast({ text: error });
            return;
        };
        setLoading(true);

        const data = {
            userGroupName: name,
            userEmail: email
        }

        dispatch(addUserToGroup(data));
    }

    /**
     * This function renders the component to the DOM
     */
    return (
        <ModalWrapper title="Add a User to a Group">
            <form className="space-y-6" onSubmit={(event) => formSubmit(event)}>
                <div>
                    <InputLabel htmlFor="name" text="Group Name" />
                    <Input type="text" name="name" id="name" placeholder="Paper Sales" required={true} disabled={loading} value={name} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        nameError && setNameError(false);
                        setName(event.currentTarget.value);
                    }} maxLength={20} error={nameError} />
                </div>
                <div>
                    <InputLabel htmlFor="email" text="User Email" />
                    <Input type="email" name="email" id="email" placeholder="john@example.com" required={true} disabled={loading} value={email} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        emailError && setEmailError(false);
                        setEmail(event.currentTarget.value);
                    }} error={emailError} />
                </div>
                <SubmitButton text="Create Group" onClick={(event: React.FormEvent<HTMLFormElement>) => {
                    formSubmit(event);
                }} className="w-full" loading={loading} />
            </form>
        </ModalWrapper>
    )
}