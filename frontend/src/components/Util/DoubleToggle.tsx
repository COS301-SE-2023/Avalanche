import { Switch } from '@headlessui/react'

interface IToggle {
    name: string,
    onChange: any,
    value: boolean,
    leftTitle: string,
    rightTitle: string
}

export default function DoubleToggle({ name, onChange, value, leftTitle, rightTitle }: IToggle) {
    return <div className='flex gap-3'>
        <label htmlFor={name} className="text-sm font-medium text-gray-900 dark:text-gray-300">{leftTitle}</label>
        <Switch
            id={name}
            checked={value}
            onChange={onChange}
            className={`${value ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
            <span
                className={`${value ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
        </Switch>
        <label htmlFor={name} className="text-sm font-medium text-gray-900 dark:text-gray-300">{rightTitle}</label>
    </div>
}