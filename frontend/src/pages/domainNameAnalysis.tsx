import GraphZoomModal from "@/components/Modals/GraphZoomModal";
import Sidebar from "@/components/Navigation/SideBar";
import { DashboardBase, MainContent, SubmitButton } from "@/components/Util";
import PageHeader from "@/components/Util/PageHeader";
import { clearGraphData, getDashboardGraphs, graphState } from "@/store/Slices/graphSlice";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice";
import { EyeIcon } from "@heroicons/react/24/solid";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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

    function loadData() {
        dispatch(getDashboardGraphs('domainNameAnalysis/count'));
        // const arrayDomainNameAnalysisShare: IDomainNameAnalysisGraphRequest[] = [];

        // const ageAnalysisAverageTop5: IDomainNameAnalysisGraphRequest = { granularity: 'week', num: 5, minimumAppearances: 150 };
        // arrayDomainNameAnalysisShare.push(ageAnalysisAverageTop5);

        // const ageAnalysisTop5: IDomainNameAnalysisGraphRequest = { granularity: 'week', num: 1, minimumAppearances: 30 };
        // arrayDomainNameAnalysisShare.push(ageAnalysisTop5);

        // const marketShareTop20: IDomainNameAnalysisGraphRequest = { granularity: 'week', num: 2, minimumAppearances: 50 };
        // arrayDomainNameAnalysisShare.push(marketShareTop20);

        // const ageAnalysisTop10: IDomainNameAnalysisGraphRequest = { granularity: 'week', num: 15, minimumAppearances: 150 };
        // arrayDomainNameAnalysisShare.push(ageAnalysisTop10);

        // arrayDomainNameAnalysisShare.forEach(data => {
        //     dispatch(getDomainNameAnalysisData(data));
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
            <title>Domain Name Analysis</title>
        </Head>
        <Sidebar />

        <MainContent>
            <div className="flex justify-between items-center">
                <PageHeader title="Domain Name Analysis" subtitle="Identifying trending keywords or themes" icon={<EyeIcon className="h-16 w-16 text-black dark:text-white" />} />
                <SubmitButton text="Download Report" onClick={() => generatePDF()} />
            </div>
            <DashboardBase state={stateGraph} />
        </MainContent>
        {
            modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />
        }
    </>)
}