interface IInputLabel {
    htmlFor: string,
    text: string,
    className?: string
}

export default function InputLabel({ htmlFor, text, className = "" }: IInputLabel) {
    return <label htmlFor={htmlFor} className={"block mb-2 text-sm font-medium text-gray-900 dark:text-white " + className}>{text}</label>
}