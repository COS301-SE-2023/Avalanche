import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { ChartBarIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { useDispatch, useSelector } from "react-redux";
import { graphState, getMarketShareData, clearGraphData, getDashboardGraphs } from "@/store/Slices/graphSlice"
import { useEffect } from "react";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import IMarketShareGraphRequest from "@/interfaces/requests/MarketShareGraph"
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { SubmitButton, MainContent, DashboardBase } from "@/components/Util"

export default function MarketShare() {

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

    function loadData() {
        dispatch(getDashboardGraphs('marketShare'));
        // const arrayMarketShare: IMarketShareGraphRequest[] = [];
        // const currentDate = new Date();

        // const marketShareTop5: IMarketShareGraphRequest = { rank: 'top5', registrar: ['Individual'] };
        // arrayMarketShare.push(marketShareTop5);

        // const marketShareTop10: IMarketShareGraphRequest = { rank: 'top10' };
        // arrayMarketShare.push(marketShareTop10);

        // const marketShareTop20: IMarketShareGraphRequest = { rank: 'top20' };
        // arrayMarketShare.push(marketShareTop20);

        // arrayMarketShare.forEach(data => {
        //     dispatch(getMarketShareData(data));
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

    return (<>
        <Head>
            <title>Market Share</title>
        </Head>
        <Sidebar />

        <MainContent>
            <div className="flex justify-between items-center">
                <PageHeader title="Market Share" subtitle="See who you are competing against" icon={<ChartBarIcon className="h-16 w-16 text-black dark:text-white" />} />
                <SubmitButton text="Download Report" onClick={() => generatePDF()} />
            </div>
            <DashboardBase state={stateGraph} />
        </MainContent>
        {
            modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />
        }
    </>)
}