import { ModalWrapper } from './ModalOptions';
import { useState } from 'react';
import { BarChart, BubbleChart, LineChart, PieChart, PolarAreaChart, RadarChart } from "@/components/Graphs";
import { selectModalManagerState, setZoomData, clearZoomData } from '@/store/Slices/modalManagerSlice';
import { useSelector } from 'react-redux';
import { ChartType } from '@/Enums';
import { ErrorToast } from '../Util';
import ky, { HTTPError } from 'ky';
import { getCookie } from 'cookies-next';

interface IGraphZoomModal {
    custom?: boolean
    dashboardID?: string,
    graphName?: string,
}

export default function GraphZoomModal({ custom }: IGraphZoomModal) {

    const state = useSelector(selectModalManagerState);

    const [comment, setComment] = useState<string>("");

    const uploadComment = async (e: any) => {
        e.preventDefault();
        try {
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/addCommentToGraph`, {
                json: {
                    dashboardID: "",
                    graphName: "",
                    comment: comment
                },
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json();
            console.log(res);
        } catch (e) {
            let error = e as HTTPError;
            if (error.name === 'HTTPError') {
                const newError = await error.response.json();
                return ErrorToast({ text: newError.message });
            }
        }
    }

    return (
        <ModalWrapper title={state.data.data.graphName} large={true}>
            <div className="flex">
                <div className="relative p-6 space-y-6 flex-auto">
                    {state.data.type === ChartType.Bar && <BarChart data={state.data.data} />}
                    {state.data.type === ChartType.Pie && <PieChart data={state.data.data} />}
                    {state.data.type === ChartType.Line && <LineChart data={state.data.data} addClass="h-full" />}
                    {state.data.type === ChartType.Bubble && <BubbleChart data={state.data.data} />}
                    {state.data.type === ChartType.PolarArea && <PolarAreaChart data={state.data.data} />}
                    {state.data.type === ChartType.Radar && <RadarChart data={state.data.data} />}
                </div>
                {custom && <div className="flex flex-col gap-5 flex-auto">
                    <form onSubmit={(e) => uploadComment(e)}>
                        <label htmlFor="chat" className="sr-only">Your message</label>
                        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <textarea rows={2} className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..." onChange={(e) => setComment(e.target.value)}></textarea>
                            <button type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                                <svg className="w-5 h-5 rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                                </svg>
                                <span className="sr-only">Send message</span>
                            </button>
                        </div>
                    </form>
                </div>}
            </div>
        </ModalWrapper>
    )
}