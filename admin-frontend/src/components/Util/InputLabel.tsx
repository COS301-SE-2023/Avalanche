interface IInputLabel {
    htmlFor: string,
    text: string
}

export default function InputLabel({ htmlFor, text }: IInputLabel) {
    return <label htmlFor={htmlFor} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{text}</label>
}