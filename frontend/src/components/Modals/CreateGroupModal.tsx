import { useState } from 'react';
import { SubmitButton, ErrorToast, InputLabel, Input } from '../Util';
import { ModalContent, ModalHeader, ModalWrapper } from './ModalOptions';

interface ICreateGroupModal {

}

export default function CreateGroupModal({ }: ICreateGroupModal) {

    /**
     * Boolean for if something is loading in the component.
     */
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * these two variables are the fields from the form.
     */
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    /**
     * These two variables are for error checking.
     */
    const [nameError, setNameError] = useState<boolean>(false);
    const [descriptionError, setDescriptionError] = useState<boolean>(false);

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

        if (!description) {
            error += "The group is missing a description.";
            setDescriptionError(true);
        }

        if (nameError || descriptionError) {
            ErrorToast({ text: error });
            return;
        };
        setLoading(true);
        ErrorToast({ text: "Nothing is implemented yet. Un-loading in 3 seconds." });
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }

    /**
     * This function renders the component to the DOM
     */
    return (
        <ModalWrapper>
            <ModalHeader title="Create a New Group" />
            <ModalContent>
                <form className="space-y-6" onSubmit={(event) => formSubmit(event)}>
                    <div>
                        <InputLabel htmlFor="name" text="Group Name" />
                        <Input type="text" name="name" id="name" placeholder="Paper Sales" required={true} disabled={loading} value={name} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            nameError && setNameError(false);
                            setName(event.currentTarget.value);
                        }} maxLength={20} error={nameError} />
                    </div>
                    <div>
                        <InputLabel htmlFor="description" text="Group Description" />
                        <Input type="text" name="description" id="description" placeholder="This is paper sales group." required={true} disabled={loading} value={description} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            descriptionError && setDescriptionError(false);
                            setDescription(event.currentTarget.value);
                        }} maxLength={75} error={descriptionError} />
                    </div>
                    <SubmitButton text="Create Group" onClick={(event: React.FormEvent<HTMLFormElement>) => {
                        formSubmit(event);
                    }} className="w-full" loading={loading} />
                </form>
            </ModalContent>
        </ModalWrapper>
    )
}