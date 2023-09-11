export default function LoadingGrid() {
    return <div className="grid lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4 mb-4 grid-rows-2">
        <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
            <div className="flex gap-1">
                <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800  w-32 p-1.5"></div>
                <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32 p-1.5"></div>
            </div>
        </div>
        <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
            <div className="flex gap-1">
                <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
            </div>
        </div>
        <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
            <div className="flex gap-1">
                <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
            </div>
        </div>
        <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
            <div className="flex gap-1">
                <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
            </div>
        </div>
    </div>
}