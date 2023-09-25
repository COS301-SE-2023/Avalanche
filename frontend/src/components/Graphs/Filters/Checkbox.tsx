export default function CheckboxFilter({ data, request, update }: any) {
    const mapCheckbox = () => {
        return data.values?.map((element: any, index: number) => (
            <div className="flex items-center mb-1" key={index}>
                <input id={`${data.name}-${element}`} type="checkbox" value={`${data.name}-${element}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onClick={() => {
                    console.log(request);
                    var copy = [...request.value];

                    if (!copy.includes(element)) {
                        copy.push(element);
                    } else {
                        copy.splice(copy.indexOf(element), 1);
                    }

                    update(data.name, copy);
                }} checked={request?.value?.includes(element)} onChange={() => {

                }} />
                <label htmlFor={`${data.name}-${element}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{element}</label>
            </div>
        ))
    }

    return (
        <div>
            {mapCheckbox()}
        </div>
    )
}