import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

interface IDropdown {
    items: string[],
    option: string,
    set: any,
    id?: string,
    text?: string
}

export default function Dropdown({ items, option, set, id, text }: IDropdown) {
    return (
        <Menu as="div" className="relative inline-block text-left w-full" id={id}>
            <div>
                <Menu.Button className="bg-gray-50 border-2 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-thirdBackground dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-gray-300 dark:border-thirdBackground flex justify-between">
                    {option ? option : text && text || "Options"}
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-in duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="overflow-auto absolute right-0 z-20 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-height">
                    <div className="py-1 max-h-20">
                        {
                            items.map((item: any, index: number) => (
                                <Menu.Item key={index}>
                                    {({ active }) => (
                                        <span
                                            onClick={() => set(item)}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            {item}
                                        </span>
                                    )}
                                </Menu.Item>
                            ))
                        }
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}