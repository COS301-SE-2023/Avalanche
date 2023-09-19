import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { ChartBarSquareIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { useDispatch, useSelector } from "react-redux";
import { graphState, getGraphData, clearGraphData, getDashboardGraphs } from "@/store/Slices/graphSlice"
import { useEffect } from "react";
import { ITransactionGraphRequest } from "@/interfaces/requests";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { SubmitButton, MainContent, DashboardBase } from "@/components/Util"

export default function Dashboard() {

    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);

    const pad = (d: number) => {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    function loadData() {
        dispatch(getDashboardGraphs('transactions'));
        // const array: ITransactionGraphRequest[] = [];
        // const currentDate = new Date();

        // // All transactions, monthly granularity, for the last year
        // let dateFrom = `${currentDate.getFullYear() - 1}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        // let dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        // const monthlyLastYear: ITransactionGraphRequest = { granularity: "month", dateFrom, dateTo, zone: stateGraph.zones.slice(0, 1) };
        // array.push(monthlyLastYear);

        // All transactions, monthly granularity, for the year before
        dateFrom = `${currentDate.getFullYear() - 2}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        dateTo = `${currentDate.getFullYear() - 1}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const monthlyPastYear: ITransactionGraphRequest = { graphName: `Monthly, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: stateGraph.zones.slice(0, 1) };
        array.push(monthlyPastYear);

        // All transactions, yearly, 5 years
        dateFrom = `${currentDate.getFullYear() - 5}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const yearlyPastFive: ITransactionGraphRequest = { graphName: `Yearly, from ${dateFrom} to ${dateTo}`, granularity: "year", dateFrom, dateTo, zone: stateGraph.zones.slice(0, 1) };
        array.push(yearlyPastFive);

        //  All transactions, weekly, last 3 months
        let holderDate = new Date();
        holderDate.getMonth() - 3;
        dateFrom = `${holderDate.getFullYear()}-${pad(holderDate.getMonth() - 3)}-${pad(holderDate.getDate())}`;
        dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const weeklyThreeMonths: ITransactionGraphRequest = { graphName: `Weekly, from ${dateFrom} to ${dateTo}`, granularity: "week", dateFrom, dateTo, zone: stateGraph.zones.slice(0, 1) };
        array.push(weeklyThreeMonths);

        // All transactions, daily, last 2 weeks
        holderDate = new Date();
        holderDate.setDate(holderDate.getDate() - 14);
        dateFrom = `${holderDate.getFullYear()}-${pad(holderDate.getMonth())}-${pad(holderDate.getDate())}`;
        dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const dailyTwoWeeks: ITransactionGraphRequest = { graphName: `Daily, from ${dateFrom} to ${dateTo}`, granularity: "day", dateFrom, dateTo, zone: stateGraph.zones.slice(0, 1) };
        array.push(dailyTwoWeeks);

        // array.forEach(data => {
        //     dispatch(getGraphData(data));
        // })
    }

    useEffect(() => {
        if (stateGraph.cleared) {
            loadData();
        }
    }, [stateGraph.cleared])

    useEffect(() => {
        dispatch(clearGraphData());
    }, [])

    useEffect(() => {
        dispatch(clearGraphData());
    }, [stateGraph.selectedDataSource])

    const captureCanvasElements = async () => {
        const canvasElements = Array.from(document.querySelectorAll('.graphChart'));
        const canvasImages = [];

        for (const canvas of canvasElements) {
            try {
                const dataUrl = await html2canvas(canvas as any, {
                    allowTaint: true,
                    useCORS: true,
                }).then((canvas) => canvas.toDataURL('image/png'));
                canvasImages.push(dataUrl);
            } catch (error) {
                console.error('Error capturing canvas:', error);
            }
        }

        return canvasImages;
    };

    const generatePDF = async () => {
        const canvasImages = await captureCanvasElements();

        const pdf = new jsPDF("l", "mm", "a1");

        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();

        canvasImages.forEach((imageDataUrl) => {
            pdf.addImage(imageDataUrl, 'PNG', 0, 0, width, height);
            pdf.addPage();
        });

        pdf.save('report.pdf');
    };


    return (<>
        {
            modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />
        }
        <Head>
            <title>Dashboard</title>
        </Head>
        <Sidebar />

        <MainContent>
            <div className="flex justify-between items-center">
                <PageHeader title="Transactions" subtitle="Insights at your fingertips" icon={<ChartBarSquareIcon className="h-16 w-16 text-black dark:text-white" />} />
                <SubmitButton text="Download Report" onClick={() => generatePDF()} />
            </div>
            <DashboardBase state={stateGraph} />
        </MainContent>
    </>)
}