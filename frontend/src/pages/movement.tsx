import Sidebar from "@/components/Navigation/SideBar";
import PageHeader from "@/components/Util/PageHeader";
import { BoltIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { graphState, getMovementVerticalData, clearGraphData } from "@/store/Slices/graphSlice";
import { useEffect } from "react";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice";
import GraphZoomModal from "@/components/Modals/GraphZoomModal";
import IMovementGraphRequest from "@/interfaces/requests/Movement";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { DashboardBase, MainContent, SubmitButton } from "@/components/Util";

export default function Movement() {

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
        const arrayMovementVerticalShare: IMovementGraphRequest[] = [];

        const movementVertical: IMovementGraphRequest = { zone: stateGraph.zones.slice(0, 1), };
        arrayMovementVerticalShare.push(movementVertical);

        arrayMovementVerticalShare.forEach(data => {
            dispatch(getMovementVerticalData(data));
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
            <title>Nett Movement</title>
        </Head>
        <Sidebar />

        <MainContent>
            <div className="flex justify-between items-center">
                <PageHeader title="Nett Movement" subtitle="Insights at your fingertips" icon={<BoltIcon className="h-16 w-16 text-black dark:text-white" />} />
                <SubmitButton text="Download Report" onClick={() => generatePDF()} />
            </div>
            <DashboardBase state={stateGraph} />
        </MainContent>
        {
            modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />
        }
    </>)
}