import { setAnimateManagerState, clearCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { useDispatch } from 'react-redux';
import { XMarkIcon } from "@heroicons/react/24/solid";

interface IModalHeader {
    title: string,
    text?: string
}

export default function ModalHeader({ title, text }: IModalHeader) {

    const dispatch = useDispatch();

    return <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{title}</h3>
            {text && <p className="text-gray-700 dark:text-white">{text}</p>}
        </div>
        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal" onClick={(event) => {
            dispatch(setAnimateManagerState(true));
            setTimeout(() => {
                dispatch(clearCurrentOpenState())
                dispatch(setAnimateManagerState(false));
                document.body.style.overflow = "visible";
            }, 150);
        }}>
            <XMarkIcon className="h-5 w-5" />
        </button>
    </div>
}