import { Anchor, DeleteButton, SubmitButton } from '../Util';
import { ModalWrapper } from './ModalOptions';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import Link from 'next/link';

interface IFirstTimeModal {
    close: any
    cookieToSet?: any
}

export default function FirstTimeModal({ close, cookieToSet }: IFirstTimeModal) {
    const router = useRouter();

    return (
        <ModalWrapper title="Welcome to Avalanche ☃️" cookieToSet={cookieToSet}>

            <p className="text-medium mb-4 text-gray-500 italic"><span className='font-bold'>Note from the Skunkworks.</span> Thank you for testing Avalanche. There might be some things that break, if it does, a report form will pop up. You don't have to fill it in, but it would be greatly appreciated if you did. We do make use of <Anchor href="https://sentry.io" text="Sentry.io" /> to log errors automatically when they happen. Any information/data that is collected will only be used for the purpose of testing of our application (like if we need to follow up on a issue/bug you encountered). <Anchor href="https://sentry.io/privacy/" text="Sentry.io Privacy Policy" /></p>

            <p className="text-lg mb-4 text-gray-500">👋 Hey, we see that this is potentially your first time on Avalanche. Before we get things started, we would just like to confirm your purpose for using Avalanche.</p>
            <div className="flex gap-5">
                <SubmitButton text="I am here as a Registrar" onClick={() => {
                    router.push("/settings?tab=integrations");
                    close();
                }} className="w-full" />
                <DeleteButton text="I am here to look around" onClick={() => {
                    close();
                }} className="w-full" />
            </div>
        </ModalWrapper>
    )
}