import { setAnimateManagerState, clearCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { useDispatch } from 'react-redux';
import { XMarkIcon } from "@heroicons/react/24/solid";

interface IModalHeader {
    title: string,
}

export default function ModalHeader({ title }: IModalHeader) {

    const dispatch = useDispatch();

    return <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">{title}</h3>
        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal" onClick={(event) => {
            dispatch(setAnimateManagerState(true));
            setTimeout(() => {
                dispatch(clearCurrentOpenState())
                dispatch(setAnimateManagerState(false));
            }, 150);
        }}>
            <XMarkIcon className="h-5 w-5" />
        </button>
    </div>
}