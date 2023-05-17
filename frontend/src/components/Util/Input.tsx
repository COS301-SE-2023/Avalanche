import { useState } from "react";

interface IInput {
    type: string,
    placeholder: string,
    name: string,
    id: string,
    required: boolean,
    disabled?: boolean,
    onChange?: any,
    value: string,
    maxLength?: number
}

export default function Input({ type, placeholder, name, id, required, disabled = false, onChange, value, maxLength }: IInput) {
    return <>
        <input type={type} name={name} id={id} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-thirdBackground dark:border-thirdBackground dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required={required} disabled={disabled} onChange={(event) => {
            onChange(event);
        }} value={value} maxLength={maxLength} />
        {maxLength && <span className="float-right text-xs text-gray-500 dark:text-grey-200">{value.length}{maxLength && `/${maxLength}`} characters</span>}
    </>
}