import { ChangeEvent } from "react";

interface IInput {
    type: string,
    placeholder: string,
    name: string,
    id: string,
    required: boolean,
    disabled?: boolean,
    onChange?: any,
    value: string,
    maxLength?: number,
    error?: boolean,
    showLength?: boolean,
    pattern?: string
}

export default function Input({ type, placeholder, name, id, required, disabled, onChange, value, maxLength, error, showLength, pattern }: IInput) {

    /**
     * This handles the input onChange method.
     * @param event is the event that is triggered by the onChange event.
     */
    const onChangeTrigger = (event: ChangeEvent<HTMLInputElement>): void => {
        onChange(event);
    }

    /**
     * Renders out the Input component to the DOM.
     */
    return <>
        <input type={type} name={name} id={id} className={`bg-gray-50 border-2 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-thirdBackground dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${error ? "border-red-500 dark:border-red-600" : "border-gray-300 dark:border-thirdBackground"}`} placeholder={placeholder} required={required} disabled={disabled} onChange={(event) => onChangeTrigger(event)} value={value} maxLength={maxLength} />
        {maxLength && <span className="float-right text-xs text-gray-500 dark:text-grey-200">{value.length}{maxLength && `/${maxLength}`} characters</span>}
        {!maxLength && showLength && <span className="float-right text-xs text-gray-500 dark:text-grey-200">{value.length} characters</span>}
    </>
}