import { useState, useEffect } from 'react';
import { Input, InputLabel, SubmitButton, ErrorToast } from '../Util';
import { ModalContent, ModalHeader, ModalWrapper } from './ModalOptions';
import { userState, createOrganisation } from '@/store/Slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ICreateOrganisationRequest } from '@/interfaces/requests';

interface IOrgnizationCreateModal {

}

export default function OrgnizationCreateModal({ }: IOrgnizationCreateModal) {

    const dispatch = useDispatch<any>();
    const stateUser = useSelector(userState);

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

        dispatch(createOrganisation({ name } as ICreateOrganisationRequest))

    }

    /**
     * This return renders out the HTML for the modal.
     */
    return (
        <ModalWrapper>
            <ModalHeader title="Create a new Organization" />
            <ModalContent>
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
            </ModalContent>
        </ModalWrapper>
    )
}