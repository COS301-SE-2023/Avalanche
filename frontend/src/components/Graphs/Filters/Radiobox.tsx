export default function RadioboxFilter({ data }: any) {

    const mapCheckbox = () => {
        return data.values.map((element: any, index: number) => (
            <div className="flex items-center" key={index}>
                <input checked id="default-radio-2" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="default-radio-2" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{element}</label>
            </div>
        ))
    }

    return (
        <div>
            {mapCheckbox()}
        </div>
    )
}