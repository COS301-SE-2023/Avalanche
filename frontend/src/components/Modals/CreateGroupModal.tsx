import { useState, useEffect } from 'react';
import { SubmitButton, ErrorToast, InputLabel, Input, SuccessToast } from '../Util';
import { ModalWrapper } from './ModalOptions';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { userState, getUserGroups, clearLoading, clearError } from '@/store/Slices/userSlice';
import { createOrganisationGroup } from '@/store/Slices/userSlice';
import { ICreateUserGroupRequest } from '@/interfaces/requests';

interface ICreateGroupModal {

}

export default function CreateGroupModal({ }: ICreateGroupModal) {

    const dispatch = useDispatch<any>();
    const stateUser = useSelector(userState);

    useEffect(() => {
        if (stateUser.createGroupSuccess) {
            SuccessToast({ text: `Group with the name ${name} has been successfully created` });
            //dispatch(getLatestOrganisation({}));
            dispatch(getUserGroups({}));
            dispatch(clearCurrentOpenState())
        }
    }, [stateUser.user.userGroups,])

    /**
     * Boolean for if something is loading in the component.
     */
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * these two variables are the fields from the form.
     */
    const [name, setName] = useState<string>("");

    /**
     * These two variables are for error checking.
     */
    const [nameError, setNameError] = useState<boolean>(false);

    useEffect(() => {
        if (!stateUser.createGroupSuccess && stateUser.requests.error) {
            ErrorToast({ text: stateUser.requests.error });
            dispatch(clearError());
            dispatch(clearLoading());
            setLoading(false);
        }
    }, [stateUser.createGroupSuccess, stateUser.requests.error])

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

        if (nameError) {
            ErrorToast({ text: error });
            return;
        };
        setLoading(true);

        const data: ICreateUserGroupRequest = {
            name,
            permission: 2,
        }

        dispatch(createOrganisationGroup(data));
    }

    /**
     * This function renders the component to the DOM
     */
    return (
        <ModalWrapper title="Create a New Group">
            <form className="space-y-6" onSubmit={(event) => formSubmit(event)}>
                <div>
                    <InputLabel htmlFor="name" text="Group Name" />
                    <Input type="text" name="name" id="name" placeholder="Paper Sales" required={true} disabled={loading} value={name} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        nameError && setNameError(false);
                        setName(event.currentTarget.value);
                    }} maxLength={20} error={nameError} />
                </div>
                <SubmitButton text="Create Group" onClick={(event: React.FormEvent<HTMLFormElement>) => {
                    formSubmit(event);
                }} className="w-full" loading={loading} />
            </form>
        </ModalWrapper>
    )
}