interface IChartCardButton {
    children: any,
    onClick: any,
}

export default function ChartCardButton({ onClick, children }: IChartCardButton) {
    return (
        <div>
            <button className="inline-flex justify-center p-1.5 text-black rounded cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-900 hover:bg-lightHover dark:hover:bg-gray-600" onClick={() => onClick(true)}>
                {children}
            </button>
        </div >

    )
}