import { ModalContent, ModalHeader, ModalWrapper } from './ModalOptions';
import { BarChart, BubbleChart, LineChart, PieChart, PolarAreaChart, RadarChart } from "@/components/Graphs";
import { selectModalManagerState, setData } from '@/store/Slices/modalManagerSlice';
import { useSelector } from 'react-redux';
import { ChartType } from '@/Enums';

export default function GraphZoomModal() {

    const state = useSelector(selectModalManagerState);

    console.log(state.data);

    return (
        <ModalWrapper addClassAdd="h-full w-full" smallModal={false}>
            <ModalHeader title="Mr Zoom" />
            <ModalContent addClass='h-5/6'>
                <div className="relative p-6 space-y-6 w-full h-full">
                    {state.data.type === ChartType.Bar && <BarChart data={state.data.data} />}
                    {state.data.type === ChartType.Pie && <PieChart data={state.data.data} />}
                    {state.data.type === ChartType.Line && <LineChart data={state.data.data} addClass="h-full" />}
                    {state.data.type === ChartType.Bubble && <BubbleChart data={state.data.data} />}
                    {state.data.type === ChartType.PolarArea && <PolarAreaChart data={state.data.data} />}
                    {state.data.type === ChartType.Radar && <RadarChart data={state.data.data} />}
                </div>
            </ModalContent>
        </ModalWrapper>
    )
}