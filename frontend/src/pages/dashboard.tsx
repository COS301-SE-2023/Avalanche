import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { ChartBarSquareIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { ChartCard } from "@/components/Graphs"
import { ChartType } from "@/Enums";
import { useDispatch, useSelector } from "react-redux";
import { graphState, getGraphData } from "@/store/Slices/graphSlice"
import { useEffect, useRef } from "react";
import { ITransactionGraphRequest } from "@/interfaces/requests";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { SubmitButton } from "@/components/Util"

export default function Dashboard() {

    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);

    const pad = (d: number) => {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    function loadData(){
        const array: ITransactionGraphRequest[] = [];
        const currentDate = new Date();

        // All transactions, monthly granularity, for the last year
        let dateFrom = `${currentDate.getFullYear() - 1}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        let dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const monthlyLastYear: ITransactionGraphRequest = { graphName: `Monthly, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: stateGraph.zones.slice(0,1)  };
        array.push(monthlyLastYear);

        // All transactions, monthly granularity, for the year before
        dateFrom = `${currentDate.getFullYear() - 2}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        dateTo = `${currentDate.getFullYear() - 1}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const monthlyPastYear: ITransactionGraphRequest = { graphName: `Monthly, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: stateGraph.zones.slice(0,1)  };
        array.push(monthlyPastYear);

        // All transactions, yearly, 5 years
        dateFrom = `${currentDate.getFullYear() - 5}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const yearlyPastFive: ITransactionGraphRequest = { graphName: `Yearly, from ${dateFrom} to ${dateTo}`, granularity: "year", dateFrom, dateTo, zone: stateGraph.zones.slice(0,1)  };
        array.push(yearlyPastFive);

        //  All transactions, weekly, last 3 months
        let holderDate = new Date();
        holderDate.getMonth() - 3;
        dateFrom = `${holderDate.getFullYear()}-${pad(holderDate.getMonth() - 3)}-${pad(holderDate.getDate())}`;
        dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const weeklyThreeMonths: ITransactionGraphRequest = { graphName: `Weekly, from ${dateFrom} to ${dateTo}`, granularity: "week", dateFrom, dateTo, zone: stateGraph.zones.slice(0,1) };
        array.push(weeklyThreeMonths);

        // All transactions, daily, last 2 weeks
        holderDate = new Date();
        holderDate.setDate(holderDate.getDate() - 14);
        dateFrom = `${holderDate.getFullYear()}-${pad(holderDate.getMonth())}-${pad(holderDate.getDate())}`;
        dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const dailyTwoWeeks: ITransactionGraphRequest = { graphName: `Daily, from ${dateFrom} to ${dateTo}`, granularity: "day", dateFrom, dateTo, zone: stateGraph.zones.slice(0,1)  };
        array.push(dailyTwoWeeks);


        array.forEach(data => {
            dispatch(getGraphData(data));
        })
    }

    useEffect(() => {
        loadData();
    }, [])

    useEffect(() => {
        loadData();
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

    const containerRef = useRef(null);

    return (<>
        {
            modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />
        }
        <Head>
            <title>Dashboard</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen" ref={containerRef}>
            <div className="flex justify-between items-center">
                <PageHeader title="Transactions" subtitle="Insights at your fingertips" icon={<ChartBarSquareIcon className="h-16 w-16 text-black dark:text-white" />} />
                <SubmitButton text="Download Report" onClick={() => generatePDF()} />
            </div>
            <div className="p-0 pt-4 md:p-4" id="pageData">
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4 mb-4 grid-rows-2">
                    {
                        stateGraph.graphs?.length > 0 && stateGraph.graphs.map((data: any, index: number) => {
                            if (data) return <ChartCard title={data.graphName} data={data} defaultGraph={ChartType.Line} key={index} />
                        })
                    }
                    {
                        stateGraph.loading && <>
                            <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
                                <div className="flex gap-1">
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800  w-32 p-1.5"></div>
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32 p-1.5"></div>
                                </div>
                            </div>
                            <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
                                <div className="flex gap-1">
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                </div>
                            </div>
                            <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
                                <div className="flex gap-1">
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                </div>
                            </div>
                            <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
                                <div className="flex gap-1">
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                </div>
                            </div>
                            <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
                                <div className="flex gap-1">
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                </div>
                            </div>
                        </>
                    }
                    {/* <ChartCard title="A ChartJS Chart 1" data={chartData} defaultGraph={ChartType.Pie} />
                    <ChartCard title="A ChartJS Chart 2" data={chartData} defaultGraph={ChartType.Bar} />
                    <ChartCard title="A ChartJS Chart 3" data={chartData} defaultGraph={ChartType.Line} />
                    <ChartCard title="A ChartJS Chart 4" data={chartData} defaultGraph={ChartType.Radar} />
                    <ChartCard title="A ChartJS Chart 5" data={chartData} defaultGraph={ChartType.PolarArea} /> */}
                </div>
            </div>
        </div>
    </>)
}