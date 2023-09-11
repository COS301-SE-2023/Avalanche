import { Switch } from '@headlessui/react'

export default function ToggleFilter({ data, request, update }: any) {
    return (
        <div className='flex gap-3'>
            <label htmlFor={data.name} className="text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
            <Switch
                id={data.name}
                checked={request.value}
                value={request.value}
                onChange={() => update(data.name, !request.value)}
                className={`${request.value ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
                <span
                    className={`${request.value ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
            </Switch>
            <label htmlFor={data.name} className="text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
        </div>

    )
}