import GraphZoomModal from "@/components/Modals/GraphZoomModal";
import Sidebar from "@/components/Navigation/SideBar";
import { DashboardBase, MainContent, SubmitButton } from "@/components/Util";
import PageHeader from "@/components/Util/PageHeader";
import { clearGraphData, getDashboardGraphs, graphState } from "@/store/Slices/graphSlice";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice";
import { ChartBarSquareIcon } from "@heroicons/react/24/solid";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Dashboard() {

    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);

    const pad = (d: number) => {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    function loadData() {
        dispatch(getDashboardGraphs('transactions'));

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
                <PageHeader title="Transactions" subtitle="Gain insights into your transactional data" icon={<ChartBarSquareIcon className="h-16 w-16 text-black dark:text-white" />} />
                <SubmitButton text="Download Report" onClick={() => generatePDF()} />
            </div>
            <DashboardBase state={stateGraph} />
        </MainContent>
    </>)
}