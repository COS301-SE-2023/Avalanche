import NoFind from "../CustomSVG/NoFind";
import WarningAlert from "./WarningAlert";

export default function GraphErrors({ error }: any) {
    return <div className="flex items-center flex-col gap-2">
        <NoFind className="h-48 w-48" />
        <h3 className="text-3xl font-medium text-gray-700 dark:text-white">No Data</h3>
        <p className='text-xl text-gray-600 dark:text-gray-400'>There was no data returned. Try another dashboard.</p>
        {error && <WarningAlert title="Error Trace: " text={error} report="We have automatically logged the error." />}
    </div>
}