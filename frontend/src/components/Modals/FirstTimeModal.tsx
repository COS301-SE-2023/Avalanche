import { useState } from 'react';
import { DeleteButton, SubmitButton, ErrorToast } from '../Util';
import { ModalWrapper } from './ModalOptions';

// Redux Stuff
import { setAnimateManagerState, clearCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { userState } from '@/store/Slices/userSlice';
import { useRouter } from 'next/router';

interface IFirstTimeModal {
    close: any
    cookieToSet?: any
}

export default function FirstTimeModal({ close, cookieToSet }: IFirstTimeModal) {
    const router = useRouter();

    return (
        <ModalWrapper title="Welcome to Avalanche ☃️" cookieToSet={cookieToSet}>
            <p className="text-sm mb-4 text-gray-500">👋 Hey, we see that this is potentially your first time on Avalanche. Before we get things started, we would just like to confirm your purpose for using Avalanche.</p>
            <div className="flex gap-5">
                <SubmitButton text="I am here as a Registrar" onClick={(event: React.FormEvent<HTMLFormElement>) => {
                    router.push("/settings?tab=integrations");
                }} className="w-full" />
                <DeleteButton text="I am here to look around" onClick={(event: React.FormEvent<HTMLFormElement>) => {
                    close();
                }} className="w-full" />
            </div>
        </ModalWrapper>
    )
}