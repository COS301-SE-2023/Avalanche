import { useState } from 'react';
import { DeleteButton, ErrorToast, SubmitButton } from '../Util';
import { ModalWrapper } from './ModalOptions';

// Redux Stuff
import { clearCurrentOpenState, setAnimateManagerState } from '@/store/Slices/modalManagerSlice';
import { useDispatch } from 'react-redux';

interface IConfirmModal {
    text: string,
    buttonSuccess: string,
    buttonCancel: string,
    title: string
}

export default function ConfirmModal({ text, buttonSuccess, buttonCancel, title }: IConfirmModal) {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState<boolean>(false);

    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        ErrorToast({ text: "Nothing is implemented yet. Un-loading in 3 seconds." });
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }

    return (
        <ModalWrapper title={title}>
            <p className="text-sm mb-4 text-gray-500">{text}</p>
            <form className="flex gap-5" onSubmit={(event) => formSubmit(event)}>
                <SubmitButton text={buttonSuccess} onClick={(event: React.FormEvent<HTMLFormElement>) => {
                    formSubmit(event);
                    setLoading(true);
                }} className="w-full" loading={loading} />
                <DeleteButton text={buttonCancel} onClick={(event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    dispatch(clearCurrentOpenState());
                    dispatch(setAnimateManagerState(true));
                }} className="w-full" disabled={loading} />
            </form>
        </ModalWrapper>
    )
}