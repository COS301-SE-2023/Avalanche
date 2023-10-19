import NoFind from "../CustomSVG/NoFind";
import WarningAlert from "./WarningAlert";

export default function GraphErrors({ error }: any) {
    return <div className="flex items-center flex-col gap-2">
        <NoFind className="h-48 w-48" />
        <h3 className="text-3xl font-medium text-gray-700 dark:text-white">Whoops...</h3>
        <p className='text-xl text-gray-600 dark:text-gray-400'>There was an unexpected error on our mountain. We are looking into it.</p>
        {error && <WarningAlert title="Error: " text={error} report="We have automatically logged the error." />}
    </div>
}