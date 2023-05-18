import { useState } from 'react';
import { DeleteButton, SubmitButton, ErrorToast } from '../Util';
import { ModalContent, ModalHeader, ModalWrapper } from './ModalOptions';

// Redux Stuff
import { setAnimateManagerState } from '@/store/modalManagerSlice';
import { useDispatch } from 'react-redux';

interface IConfirmModal {
    handleModal: any,
    text: string,
    buttonSuccess: string,
    buttonCancel: string,
    title: string
}

export default function ConfirmModal({ handleModal, text, buttonSuccess, buttonCancel, title }: IConfirmModal) {
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
        <ModalWrapper handle={handleModal}>
            <ModalHeader title={title} handle={handleModal} />
            <ModalContent>
                <p className="text-sm mb-4">{text}</p>
                <form className="flex gap-5" onSubmit={(event) => formSubmit(event)}>
                    <SubmitButton text={buttonSuccess} onClick={(event: React.FormEvent<HTMLFormElement>) => {
                        formSubmit(event);
                        setLoading(true);
                    }} className="w-full" loading={loading} />
                    <DeleteButton text={buttonCancel} onClick={(event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        handleModal(event, false);
                        dispatch(setAnimateManagerState(true));
                    }} className="w-full" disabled={loading} />
                </form>
            </ModalContent>
        </ModalWrapper>
    )
}