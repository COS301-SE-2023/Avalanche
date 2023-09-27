import { Switch } from '@headlessui/react'

interface IToggle {
    name: string,
    id: string
    onChange: any,
    value: boolean,
    label: string,
}

export default function Toggle({ name, onChange, value, label, id }: IToggle) {
    return <div className='flex gap-3'>
        <label htmlFor={name} className="text-sm font-medium text-gray-900 dark:text-gray-300">{label}</label>
        <Switch
            id={id}
            name={name}
            checked={value}
            onChange={() => onChange(!value)} // returns the updated value
            className={`${value ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
        >
            <span
                className={`${value ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
        </Switch>
    </div>
}