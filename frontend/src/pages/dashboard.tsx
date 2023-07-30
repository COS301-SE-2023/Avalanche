import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { ChevronDownIcon, HomeIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { ChartCard } from "@/components/Graphs"
import { ChartType } from "@/Enums";
import { useDispatch, useSelector } from "react-redux";
import { graphState, getGraphData } from "@/store/Slices/graphSlice"
import { useState, useEffect } from "react";
import { ITransactionGraphRequest } from "@/interfaces/requests";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function Dashboard() {

    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);

    const pad = (d: number) => {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    useEffect(() => {
        // const data: ITransactionGraphRequest = { zone: "CO.ZA", granularity: "week", group: "registrar", dateFrom: "2023-01-02", graphName: "Your mom" };

        const array: ITransactionGraphRequest[] = [];
        const currentDate = new Date();

        // All transactions, monthly granularity, for the last year
        let dateFrom = `${currentDate.getFullYear() - 1}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        let dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const monthlyLastYear: ITransactionGraphRequest = { graphName: `Monthly, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: ["WIEN"] };
        array.push(monthlyLastYear);

        // All transactions, monthly granularity, for the year before
        dateFrom = `${currentDate.getFullYear() - 2}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        dateTo = `${currentDate.getFullYear() - 1}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const monthlyPastYear: ITransactionGraphRequest = { graphName: `Monthly, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: ["WIEN"] };
        array.push(monthlyPastYear);

        // All transactions, yearly, 5 years
        dateFrom = `${currentDate.getFullYear() - 5}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const yearlyPastFive: ITransactionGraphRequest = { graphName: `Yearly, from ${dateFrom} to ${dateTo}`, granularity: "year", dateFrom, dateTo, zone: ["WIEN"] };
        array.push(yearlyPastFive);

        //  All transactions, weekly, last 3 months
        let holderDate = new Date();
        holderDate.getMonth() - 3;
        dateFrom = `${holderDate.getFullYear()}-${pad(holderDate.getMonth() - 3)}-${pad(holderDate.getDate())}`;
        dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const weeklyThreeMonths: ITransactionGraphRequest = { graphName: `Weekly, from ${dateFrom} to ${dateTo}`, granularity: "week", dateFrom, dateTo, zone: ["WIEN"] };
        array.push(weeklyThreeMonths);

        // All transactions, daily, last 2 weeks
        holderDate = new Date();
        holderDate.setDate(holderDate.getDate() - 14);
        dateFrom = `${holderDate.getFullYear()}-${pad(holderDate.getMonth())}-${pad(holderDate.getDate())}`;
        dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const dailyTwoWeeks: ITransactionGraphRequest = { graphName: `Daily, from ${dateFrom} to ${dateTo}`, granularity: "day", dateFrom, dateTo, zone: ["WIEN"] };
        array.push(dailyTwoWeeks);


        array.forEach(data => {
            dispatch(getGraphData(data));
        })

        // dispatch(getGraphDataArray(array));
    }, [])

    function wrap() {
        return new Promise((resolve) => setTimeout(resolve, 500));
    }

    async function logging(pdf: any, canva: any, width: any, height: any) {
        await wrap();
        if (typeof canva === 'object') {
            // console.log(canva);
            html2canvas(canva as any).then(async (caravan) => {
                const imgData = caravan.toDataURL('image/png');
                // console.log(imgData);
                // const imgData = caravan.getContext("2d", { willReadFrequently: true })?.getImageData();
                pdf.addImage(imgData, 'JPEG', 0, 0, width, height, "woooo", "FAST", 0);
                pdf.addPage();
                // console.log(caravan);
            })
        }
    }

    const downloadPDF = async () => {
        // console.log(s)
        const input = document.getElementById('pageData');
        const canvas = document.getElementsByClassName('graphChart');
        console.log(canvas);

        var doc = new jsPDF("l", "mm", "a10");
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();

        for (let c in canvas) {
            const canva = canvas[c];
            await logging(doc, canva, width, height);
        }

        doc.save(`home.pdf`);

        // html2canvas(input as any)
        //     .then((canvas) => {
        //         const imgData = canvas.toDataURL('image/png');
        //         const pdf = new jsPDF('p', 'pt', 'a4');
        //         console.log(pdf.canvas.height)

        //         pdf.addImage(imgData, 'JPEG', 0, 0, pdf.canvas.width, pdf.canvas.height, "woooo", "FAST", 0);
        //         pdf.addPage();
        //         pdf.save(`home.pdf`);
        //     });
    }

    return (<>
        {
            modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />
        }
        <Head>
            <title>Dashboard</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Home" subtitle="Insights at your fingertips" icon={<HomeIcon className="h-16 w-16 text-black dark:text-white" />} />
                <button onClick={() => downloadPDF()}>Download</button>
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