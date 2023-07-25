import { useState } from 'react';
import { SubmitButton, InputLabel, Input } from '../Util';
import { ModalWrapper } from './ModalOptions';
import { useDispatch } from 'react-redux';
import { clearCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/router";

interface ICreateDashboardModal {

}

export default function CreateDashboardModal({ }: ICreateDashboardModal) {

    const dispatch = useDispatch<any>();
    const router = useRouter();

    /**
     * these two variables are the fields from the form.
     */
    const [name, setName] = useState<string>("");

    /**
     * These two variables are for error checking.
     */
    const [nameError, setNameError] = useState<boolean>(false);

    /**
     * This function handles the form submit.
     * @param event is the event triggered by the form
     */
    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        dispatch(clearCurrentOpenState());
        router.push({
            pathname: `/custom/${uuidv4()}`,
            query: { name: name }
        });
    }

    return (
        <ModalWrapper title="Create a new custom dashboard">
            <form onSubmit={(event) => formSubmit(event)} className='flex flex-col gap-5'>
                <div>
                    <InputLabel htmlFor="name" text="Dashboard Name" />
                    <Input type="text" name="name" id="name" placeholder="Paper Sales" required={true} value={name} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        nameError && setNameError(false);
                        setName(event.currentTarget.value);
                    }} maxLength={20} error={nameError} />
                </div>
                <SubmitButton text="Create Dashboard" onClick={(event: React.FormEvent<HTMLFormElement>) => {
                    formSubmit(event);
                }} className="w-full" />
            </form>
        </ModalWrapper>
    )
}