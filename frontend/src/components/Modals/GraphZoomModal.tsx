import { ModalWrapper } from './ModalOptions';
import { useState } from 'react';
import { BarChart, BubbleChart, LineChart, PieChart, PolarAreaChart, RadarChart, TableChart } from "@/components/Graphs";
import { selectModalManagerState, setZoomData } from '@/store/Slices/modalManagerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ChartType } from '@/Enums';
import { ErrorToast } from '../Util';
import ky, { HTTPError } from 'ky';
import { getCookie } from 'cookies-next';
import { userState, updateDashboards } from "@/store/Slices/userSlice"
import { useEffect } from "react";

interface IGraphZoomModal {
    custom?: boolean
    dashboardID?: string,
    graphName?: string,
}

export default function GraphZoomModal({ custom }: IGraphZoomModal) {

    const state = useSelector(selectModalManagerState);
    const stateUser = useSelector(userState);
    const dispatch = useDispatch<any>();
    const [data, setData] = useState<any>({});

    const [comment, setComment] = useState<string>("");

    const uploadComment = async (e: any) => {
        e.preventDefault();
        try {
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/addCommentToGraph`, {
                json: {
                    dashboardID: state.zoomedData.dashboardID,
                    graphName: state.zoomedData.graphName,
                    comment: comment
                },
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json();
            const dashboard = res as any;
            dispatch(updateDashboards(dashboard.message));
            setComment("");
        } catch (e) {
            let error = e as HTTPError;
            if (error.name === 'HTTPError') {
                const newError = await error.response.json();
                return ErrorToast({ text: newError.message });
            }
        }
    }

    const renderComments = () => {
        const dash = stateUser.user.dashboards?.find((item: any) => item.dashboardID == state.zoomedData?.dashboardID);
        const graph = dash?.graphs?.find((item: any) => item.graphName === state.zoomedData?.graphName);
        return graph?.comments?.map((item: any, index: number) => (<div key={index} className="w-full p-4 text-gray-500 bg-white rounded-lg shadow dark:bg-gray-800 dark:text-gray-400" role="alert">
            <div className="flex">
                <img className="w-8 h-8 rounded-full shadow-lg" src="https://github.com/michaelrosstarr.png" alt="Jese Leos image" />
                <div className="ml-3 text-sm font-normal">
                    <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">{item.userName}</span>
                    <div className="mb-2 text-sm font-normal">{item.comment}</div>
                </div>
            </div>
        </div>))
    }

    useEffect(() => {
        console.log(state);
        if(state.data.data.jsonData){
            setData(state.data.data);
        }
        
        const check = data;
        console.log(check);
    }, [state.data.data])

    

    if (!state.data) {
        return (
            <ModalWrapper title={state.zoomedData?.graphName || state.graphName} large={true}>
                <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6" />
            </ModalWrapper>
        )
    }
    
    return (
        <ModalWrapper title={state.zoomedData?.graphName || state.graphName} large={true}>
            <div className="flex">
                <div className="relative p-6 space-y-6 flex-auto">
                    {state.data.type === ChartType.Bar && data.jsonData && <BarChart data={data} height='450%'/>}
                    {state.data.type === ChartType.Pie && data.jsonData &&<PieChart data={data} height='450%'/>}
                    {state.data.type === ChartType.Line && data.jsonData &&<LineChart data={data} height='450%'/>}
                    {state.data.type === ChartType.Bubble && data.jsonData &&<BubbleChart data={data} height='450%'/>}
                    {state.data.type === ChartType.PolarArea && data.jsonData &&<PolarAreaChart data={data} height='450%'/>}
                    {state.data.type === ChartType.Radar && data.jsonData &&<RadarChart data={data} height='450%'/>}
                    {state.data.type === ChartType.Table && data.jsonData &&<TableChart data={data} />}
                </div>
                {custom && <div className="flex flex-col gap-5 flex-auto">
                    <form onSubmit={(e) => uploadComment(e)}>
                        <label htmlFor="chat" className="sr-only">Your message</label>
                        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <textarea rows={2} className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..." onChange={(e) => setComment(e.target.value)} value={comment}></textarea>
                            <button type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                                <svg className="w-5 h-5 rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                                </svg>
                                <span className="sr-only">Send message</span>
                            </button>
                        </div>
                    </form>
                    <div className='flex flex-col gap-2 overflow-y-scroll mb-20'>
                        {renderComments()}
                    </div>
                </div>}
            </div>
        </ModalWrapper>
    )
}