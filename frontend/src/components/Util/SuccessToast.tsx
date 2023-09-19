import { CheckIcon } from "@heroicons/react/24/solid"
import toast from "react-hot-toast"

interface IToast {
    text: string
}

export default function SuccessToast({ text }: IToast) {
    toast.custom((t) => (
        <div className={`${t.visible ? 'animate__animated animate__fadeInDown' : 'animate__animated animate__fadeOutUp'
            } max-w-md`}>
            <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    <CheckIcon className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{text}</div>
            </div>
        </div>
    ))
}