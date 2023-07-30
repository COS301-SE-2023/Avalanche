import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { MapIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { ChartCard } from "@/components/Graphs"
import { ChartType } from "@/Enums";
import { useDispatch, useSelector } from "react-redux";
import { graphState, getGraphDataRanking } from "@/store/Slices/graphSlice"
import { useEffect } from "react";
import { ITransactionGraphRequest } from "@/interfaces/requests";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { SubmitButton } from "@/components/Util"

export default function RegistrarMarketComparison() {

    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);

    const pad = (d: number) => {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

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

        const pdf = new jsPDF("l", "mm", "a10");

        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();

        canvasImages.forEach((imageDataUrl) => {
            pdf.addImage(imageDataUrl, 'PNG', 0, 0, width, height);
            pdf.addPage();
        });

        pdf.save('report.pdf');
    };

    useEffect(() => {
        // const data: ITransactionGraphRequest = { zone: "CO.ZA", granularity: "week", group: "registrar", dateFrom: "2023-01-02", graphName: "Your mom" };
        const arrayRanking: ITransactionGraphRequest[] = [];
        const currentDate = new Date();

        // All transactions, monthly granularity, for the last year
        let dateFrom = `${currentDate.getFullYear() - 1}-01-01`;
        let dateTo = `${currentDate.getFullYear() - 1}-12-31`;
        const monthlyLastYearRenewRanking: ITransactionGraphRequest = { graphName: `Monthly renew ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: ['WIEN'], registrar: ["1und1", "registrygate", "internetx"], transactions: ["renew"] };
        arrayRanking.push(monthlyLastYearRenewRanking);
        const monthlyLastYearCreateRanking: ITransactionGraphRequest = { graphName: `Monthly create ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: ['WIEN'], registrar: ["1und1", "registrygate", "internetx"], transactions: ["create"] };
        arrayRanking.push(monthlyLastYearCreateRanking);
        // const monthlyLastYearTransferRanking: ITransactionGraphRequest = { graphName: `Monthly grace ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: 'WIEN', registrar : ["1und1","registrygate","internetx"], transactions : ["grace"] };
        // arrayRanking.push(monthlyLastYearTransferRanking);

        //  All transactions, weekly, last 3 months
        let holderDate = new Date();
        holderDate.getMonth() - 3;
        dateFrom = `${holderDate.getFullYear()}-${pad(holderDate.getMonth() - 3)}-01`;
        dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;
        const monthlyThreeMonthsTransferRanking: ITransactionGraphRequest = { graphName: `Monthly transfer ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, registrar: ["1und1", "registrygate", "internetx"], transactions: ["transfer"] };
        arrayRanking.push(monthlyThreeMonthsTransferRanking);
        const monthlyThreeMonthsCreateRanking: ITransactionGraphRequest = { graphName: `Monthly create ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, registrar: ["1und1", "registrygate", "internetx"], transactions: ["create"] };
        arrayRanking.push(monthlyThreeMonthsCreateRanking);
        const monthlyThreeMonthsRenewRanking: ITransactionGraphRequest = { graphName: `Monthly renew ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, registrar: ["1und1", "registrygate", "internetx"], transactions: ["renew"] };
        arrayRanking.push(monthlyThreeMonthsRenewRanking);

        arrayRanking.forEach(data => {
            dispatch(getGraphDataRanking(data));
        })

        // dispatch(getGraphDataarrayRanking(arrayRanking));
    }, [])

    return (<>
        <Head>
            <title>Registrar Market Comparison</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Registrar Market Comparison" subtitle="Insights at your fingertips" icon={<MapIcon className="h-16 w-16 text-black dark:text-white" />} />
                <SubmitButton text="Download Report" onClick={() => generatePDF()} />
            </div>
            <div className="p-0 pt-4 md:p-4">
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
                            <div role="status" className="flex justify-between h-64 w-full bg-gray-300 rounded-lg animate-customPulse dark:bg-gray-700 p-6">
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32"></div>
                                <div className="flex gap-1">
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                    <div className="h-6 w-6 bg-gray-200 rounded dark:bg-gray-800 w-32"></div>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
        {
            modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />
        }
    </>)
}