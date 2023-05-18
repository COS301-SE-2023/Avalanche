import { setAnimateManagerState } from '@/store/modalManagerSlice';
import { useDispatch } from 'react-redux';

interface IModalWrapper {
    children: any,
    handle(event: any, value: boolean): void
}

export default function ModalWrapper({ children, handle }: IModalWrapper) {
    const dispatch = useDispatch();
    return <div tabIndex={-1} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full h-screen flex justify-center items-center bg-slate-900/50" onClick={(event) => {
        handle(event, false);
        dispatch(setAnimateManagerState(true));
    }}>
        <div className="relative w-full max-w-md max-h-full" onClick={(event) => event.stopPropagation()}>
            <div className="relative bg-white rounded-lg shadow dark:bg-primaryBackground px-6 py-6 lg:px-8">
                {children}
            </div>
        </div>
    </div>
}