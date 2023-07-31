import { XMarkIcon } from "@heroicons/react/24/solid"
import toast from "react-hot-toast"

interface IErrorToast {
    text: string
}

export default function ErrorToast({ text }: IErrorToast) {
    toast.custom((t) => (
        <div className={`${t.visible ? 'animate__animated animate__fadeInDown' : 'animate__animated animate__fadeOutUp'
            } max-w-md`}>
            <div id="toast-warning" className="flex items-center w-full p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
                    <XMarkIcon className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{text}</div>
            </div>
        </div>
    ))
}