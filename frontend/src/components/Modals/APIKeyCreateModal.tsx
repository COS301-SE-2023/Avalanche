import { useState } from 'react';
import { Input, InputLabel, SubmitButton, ErrorToast } from '../Util';
import toast from 'react-hot-toast';
import 'animate.css';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ModalHeader, ModalWrapper } from './ModalOptions';

interface IAPIKeyCreateModal {
    handleModal: any
}

export default function APIKeyCreateModal({ handleModal }: IAPIKeyCreateModal) {

    const [name, setName] = useState<string>("");
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
            <ModalHeader title="Create a new API key" handle={handleModal} />
            <form className="space-y-6" onSubmit={(event) => formSubmit(event)}>
                <div>
                    <InputLabel htmlFor="name" text="API Key Name" />
                    <Input type="text" name="name" id="name" placeholder="Best API Key" required={true} disabled={loading} value={name} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        setName(event.currentTarget.value);
                    }} maxLength={20} />
                </div>
                <SubmitButton text="Create key" onClick={(event: React.FormEvent<HTMLFormElement>) => {
                    formSubmit(event);
                    setLoading(true);
                }} className="w-full" loading={loading} />
            </form>
        </ModalWrapper>
    )
}