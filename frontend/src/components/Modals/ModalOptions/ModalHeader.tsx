import { XMarkIcon } from "@heroicons/react/24/solid";

interface IModalHeader {
    title: string,
    handle(event: any, value: boolean): void
}

export default function ModalHeader({ title, handle }: IModalHeader) {
    return <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">{title}</h3>
        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal" onClick={(event) => handle(event, false)}>
            <XMarkIcon className="h-5 w-5" />
        </button>
    </div>
}