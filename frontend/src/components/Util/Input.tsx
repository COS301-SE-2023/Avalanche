interface IInput {
    type: string,
    placeholder: string,
    name: string,
    id: string,
    required: boolean
}

export default function Input({ type, placeholder, name, id, required }: IInput) {
    return <input type={type} name={name} id={id} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-thirdBackground dark:border-thirdBackground dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required={required} />
}