import { setAnimateManagerState, clearCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { useDispatch } from 'react-redux';
import ModalAnimationWrapper from './ModalAnimationWrapper';

interface IModalWrapper {
    children: any,
    addClass?: string
    addClassAdd?: string,
    smallModal?: boolean
}

export default function ModalWrapper({ children, addClass, addClassAdd, smallModal = true }: IModalWrapper) {
    const dispatch = useDispatch();
    document.body.style.overflow = "hidden";
    return <ModalAnimationWrapper><div tabIndex={-1} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-screen flex justify-center items-center bg-slate-900/50" onClick={(event) => {
        dispatch(setAnimateManagerState(true));
        setTimeout(() => {
            dispatch(clearCurrentOpenState());
            dispatch(setAnimateManagerState(false));
            document.body.style.overflow = "visible";
        }, 150);
    }}>
        {/*  */}
        <div className={`relative w-full h-full ${smallModal && "max-w-md max-h-full"}`} onClick={(event) => event.stopPropagation()}>
            <div className={`relative bg-white rounded-lg shadow dark:bg-primaryBackground px-6 py-6 lg:px-8 ${addClassAdd}`}>
                {children}
            </div>
        </div>
    </div></ModalAnimationWrapper>
}