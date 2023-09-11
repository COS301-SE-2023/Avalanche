import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { ClipboardIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { ChartCard } from "@/components/Graphs"
import { ChartType } from "@/Enums";
import { useDispatch, useSelector } from "react-redux";
import { graphState, getDomainLengthData, clearGraphData } from "@/store/Slices/graphSlice"
import { useEffect } from "react";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import IDomainNameAnalysisGraphRequest from "@/interfaces/requests/DomainNameAnalysis"
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { SubmitButton, MainContent, WarningAlert, GraphErrors, GraphsRenderer, LoadingGrid } from "@/components/Util"
import NoFind from "@/components/CustomSVG/NoFind"

export default function DomainLength() {

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
        const arrayDomainNameAnalysisShare: IDomainNameAnalysisGraphRequest[] = [];

        const ageAnalysisAverageTop5: IDomainNameAnalysisGraphRequest = {};
        arrayDomainNameAnalysisShare.push(ageAnalysisAverageTop5);

        const ageAnalysisTop5: IDomainNameAnalysisGraphRequest = { dateFrom: "2022-05-08" };
        arrayDomainNameAnalysisShare.push(ageAnalysisTop5);

        arrayDomainNameAnalysisShare.forEach(data => {
            dispatch(getDomainLengthData(data));
        })
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
            <title>Domain Name Analysis Length</title>
        </Head>
        <Sidebar />

        <MainContent>
            <div className="flex justify-between items-center">
                <PageHeader title="Domain Name Analysis Length" subtitle="Insights at your fingertips" icon={<ClipboardIcon className="h-16 w-16 text-black dark:text-white" />} />
                <SubmitButton text="Download Report" onClick={() => generatePDF()} />
            </div>
            <div className="p-0 pt-4 md:p-4">
                {stateGraph.loading && <LoadingGrid />}
                {stateGraph.graphs.length === 0 && stateGraph.error && <GraphErrors error={stateGraph.error} />}
                {stateGraph.graphs?.length > 0 && !stateGraph.loading && <GraphsRenderer graphs={stateGraph.graphs} />}
            </div>
        </MainContent>
        {
            modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />
        }
    </>)
}