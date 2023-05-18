import { useState } from 'react';
import { DeleteButton, SubmitButton, ErrorToast } from '../Util';
import { ModalContent, ModalHeader, ModalWrapper } from './ModalOptions';

// Redux Stuff
import { selectModalManagerState, clearCurrentOpenState } from '@/store/modalManagerSlice';
import { useDispatch, useSelector } from 'react-redux';

interface ICreateGroupModal {

}

export default function CreateGroupModal({ }: ICreateGroupModal) {

    const dispatch = useDispatch();
    const modalState = useSelector(selectModalManagerState);

    const [loading, setLoading] = useState<boolean>(false);

    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        ErrorToast({ text: "Nothing is implemented yet. Un-loading in 3 seconds." });
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }

    return (
        <ModalWrapper>
            <ModalHeader title="Create a New Group" />
            <ModalContent>
                <p className="text-sm mb-4">"Yes</p>
                <form className="flex gap-5" onSubmit={(event) => formSubmit(event)}>

                </form>
            </ModalContent>
        </ModalWrapper>
    )
}