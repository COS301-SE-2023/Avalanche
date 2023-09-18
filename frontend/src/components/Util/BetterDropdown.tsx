import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

interface IItem {
    name: string,
    value: string
}

interface IDropdown {
    items: IItem[],
    option: string,
    set: any,
    id?: string,
    text?: string,
    absolute?: boolean,
    placement?: string,
    className?: string
}

export default function BetterDropdown({ items, option, set, id, text, absolute, placement, className }: IDropdown) {

    const getName = (o: string) => {
        return items.find((item: IItem) => item.value === o)?.name;
    }

    // const [open, setOpen] = useState<boolean>(false);

    return (
        <Menu as="div" className="inline-block text-left w-full" id={id}>
            {({ open, close }) => (
                <>
                    <div>
                        <Menu.Button className={"bg-gray-50 border-2 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-thirdBackground dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-gray-300 dark:border-thirdBackground flex justify-between " + className} onClick={() => { if (open) close() }}>
                            {option ? getName(option) : text && text || "Options"}
                            <ChevronDownIcon className={`transition duration-75 -mr-1 h-5 w-5 text-gray-400 ${!open ? "" : "rotate-180"}`} />
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
                        <div className="relative">
                            <Menu.Items className={`${absolute && 'absolute'} ${placement === "below" ? "origin-top-right" : placement === "above" ? "origin-top-bottom bottom-12 mb-2" : "origin-top-right"} right-0 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-height dark:bg-thirdBackground`}>
                                <div className="py-1">
                                    {
                                        items.map((item: any, index: number) => (
                                            <Menu.Item key={index}>
                                                {({ active }) => (
                                                    <span
                                                        onClick={() => {
                                                            set(item.value);
                                                            // setOpen(false);
                                                            close();
                                                        }}
                                                        className={classNames(
                                                            active ? 'bg-gray-100 text-gray-900 dark:bg-secondaryBackground dark:text-white' : 'text-gray-700 dark:text-white',
                                                            'block px-4 py-2 text-sm cursor-pointer'
                                                        )}
                                                    >
                                                        {item.name}
                                                    </span>
                                                )}
                                            </Menu.Item>
                                        ))
                                    }
                                </div>
                            </Menu.Items>
                        </div>
                    </Transition>
                </>
            )}
        </Menu>

    )
}