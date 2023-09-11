import WarningAlert from "./WarningAlert";
import ChartError from "../CustomSVG/ChartError";

export default function ChartCardError({ error }: any) {
    return <div className="flex items-center flex-col gap-2">
        <ChartError className="h-48 w-48" />
        <h3 className="text-xl font-medium text-gray-700 dark:text-white">Something went wrong</h3>
        <p className='text-normal text-gray-600 dark:text-gray-400'>Something went wrong on our side. Just hang tight while we have a look. You can try some different filters :)</p>
        {error && <WarningAlert title="We got an error." text={error} italic={true} report="Please report this error to the developers, along with the page that you are on." />}
    </div>
}