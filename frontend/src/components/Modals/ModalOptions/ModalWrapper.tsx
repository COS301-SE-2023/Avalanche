import { setAnimateManagerState, clearCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { useDispatch } from 'react-redux';
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid';
import { setCookie } from 'cookies-next';
interface IModalWrapper {
    children: any,
    title: string,
    large?: boolean,
    cookieToSet?: any
}


export default function ModalWrapper({ children, title, large, cookieToSet }: IModalWrapper) {
    const [open, setOpen] = useState(true)
    const dispatch = useDispatch();
    const cancelButtonRef = useRef(null)

    const close = () => {
        dispatch(clearCurrentOpenState());
        dispatch(setAnimateManagerState(false));
        document.body.style.overflow = "visible";
        if (cookieToSet) {
            setCookie(cookieToSet.name, cookieToSet.data);
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => close()}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className={`flex items-end justify-center p-4 text-center sm:items-center sm:p-0 ${!large ? "min-h-full" : "h-full"}`}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className={`relative transform overflow-hidden bg-white text-left shadow-xl transition-all duration-100 sm:my-8 ${!large ? "sm:w-full sm:max-w-lg rounded-lg" : "h-full w-full"}`}>
                                <div className={`bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-dark-secondaryBackground ${large ? "h-full w-full" : ""}`}>
                                    <div className={large ? "h-full" : ""}>
                                        <div className='flex justify-between flex-row gap-4 items-center'>
                                            <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
                                                {title}
                                            </Dialog.Title>
                                            <button className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10" onClick={() => close()}>
                                                <XMarkIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                            </button>
                                        </div>

                                        <div className={`mt-3 text-center sm:mt-0 sm:text-left ${large ? "h-full" : ""}`}>
                                            <div className={`mt-2 mb-2 ${large ? "h-full" : ""}`}>
                                                {children}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <ModalFooter close={close} cancelButtonRef={cancelButtonRef} /> */}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root >
    )
}
