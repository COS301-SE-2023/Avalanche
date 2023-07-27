import { getCookie } from "cookies-next";
import { ErrorToast, SubmitButton, WarningAlert } from "../Util"
import ky, { HTTPError } from "ky";
import { useDispatch } from "react-redux";
import { updateAPI } from "@/store/Slices/userSlice";
interface IGeneralSettings {
    user: any
}

export default function GeneralSettings({ user }: IGeneralSettings) {

    const dispatch = useDispatch<any>();

    const createAPIKey = async () => {
        try {
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/createAPIKey`, {
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json();
            console.log(res);
        } catch (e) {
            let error = e as HTTPError;
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                ErrorToast({ text: errorJson.message });
                return dispatch(updateAPI(true));
            }
        }
    }

    const rerollAPIKey = async () => {
        try {
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/rerollAPIKey`, {
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json();
            console.log(res);
        } catch (e) {
            let error = e as HTTPError;
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                ErrorToast({ text: errorJson.message });
                return dispatch(updateAPI(true));
            }
        }
    }

    return (
        <>
            <h4 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">API Key</h4>
            {/* API Keys */}
            <div className="flex gap-5 justify-between items-center">
                <WarningAlert title="No API Key" text={user.api ? "You already have an API Key" : "You have no API key registered."} className="flex-auto" />
                <SubmitButton text="Create API Key" onClick={() => {
                    rerollAPIKey();
                }} className="h-full" />
            </div>
        </>
    )
}