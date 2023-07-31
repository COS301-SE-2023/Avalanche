import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { EyeIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { ChartCard } from "@/components/Graphs"
import { ChartType } from "@/Enums";
import { useDispatch, useSelector } from "react-redux";
import { graphState, getDomainNameAnalysisData } from "@/store/Slices/graphSlice"
import { useEffect } from "react";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import IDomainNameAnalysisGraphRequest from "@/interfaces/requests/DomainNameAnalysis"
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { SubmitButton } from "@/components/Util"

export default function DomainNameAnalysis() {

    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);

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

    useEffect(() => {

        const arrayDomainNameAnalysisShare: IDomainNameAnalysisGraphRequest[] = [];

        const ageAnalysisAverageTop5: IDomainNameAnalysisGraphRequest = { granularity: 'week', num: 5, minimumAppearances: 150 };
        arrayDomainNameAnalysisShare.push(ageAnalysisAverageTop5);

        const ageAnalysisTop5: IDomainNameAnalysisGraphRequest = { granularity: 'week', num: 1, minimumAppearances: 30 };
        arrayDomainNameAnalysisShare.push(ageAnalysisTop5);

        const marketShareTop20: IDomainNameAnalysisGraphRequest = { granularity: 'week', num: 2, minimumAppearances: 50 };
        arrayDomainNameAnalysisShare.push(marketShareTop20);

        const ageAnalysisTop10: IDomainNameAnalysisGraphRequest = { granularity: 'week', num: 15, minimumAppearances: 150 };
        arrayDomainNameAnalysisShare.push(ageAnalysisTop10);

        arrayDomainNameAnalysisShare.forEach(data => {
            dispatch(getDomainNameAnalysisData(data));
        })

    }, [])

    return (<>
        <Head>
            <title>Domain Name Analysis</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Domain Name Analysis" subtitle="Insights at your fingertips" icon={<EyeIcon className="h-16 w-16 text-black dark:text-white" />} />
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