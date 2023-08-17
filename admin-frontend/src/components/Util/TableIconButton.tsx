interface ITableIconButton {
    icon: any,
    children?: any,
    colour: string,
    handleModal(value: boolean): void
}

export default function TableIconButton({ icon, colour, handleModal }: ITableIconButton) {
    return <button type="button" className={`text-gray-400 bg-transparent border border-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-2 ml-auto inline-flex items-center dark:hover:bg-${colour}-50 dark:hover:text-white dark:hover:border-${colour}-500`} onClick={(event) => {
        handleModal(true);
    }}>
        {icon}
    </button>
}