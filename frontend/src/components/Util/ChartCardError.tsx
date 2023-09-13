import WarningAlert from "./WarningAlert";
import ChartError from "../CustomSVG/ChartError";

export default function ChartCardError({ error }: any) {
    return <div className="flex items-center flex-col gap-2">
        <ChartError className="h-48 w-48" />
        <h3 className="text-xl font-medium text-gray-700 dark:text-white">Something went wrong...</h3>
        <p className='text-normal text-gray-600 dark:text-gray-400'>Something has gone wrong on our side. We have logged the error automatically, but please still share what happened before the error occured so we can send our skunks to fix it.</p>
        {error && <WarningAlert title="Error Trace: " text={error} report="We have automatically logged the error." />}
    </div>
}