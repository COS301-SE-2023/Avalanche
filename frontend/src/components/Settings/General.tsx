import { getCookie } from "cookies-next";
import { ErrorToast, SubmitButton, WarningAlert } from "../Util"
import ky from "ky"

interface IGeneralSettings {
    user: any
}

export default function GeneralSettings({ user }: IGeneralSettings) {

    const createAPIKey = async () => {
        try {
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/createAPIKey`, {
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json();
        } catch (e) {
            console.log(e);
            if (e instanceof Error) return ErrorToast({ text: e.message });
        }
    }

    return (
        <>
            <h4 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">API Key</h4>
            {/* API Keys */}
            <div className="flex gap-5 justify-between items-center">
                <WarningAlert title="No API Key" text="You have no API key registered." className="flex-auto" />
                <SubmitButton text="Create API Key" onClick={() => {

                }} className="h-full" />
            </div>
        </>
    )
}