import GraphZoomModal from "@/components/Modals/GraphZoomModal";
import Sidebar from "@/components/Navigation/SideBar";
import { DashboardBase, MainContent, SubmitButton } from "@/components/Util";
import PageHeader from "@/components/Util/PageHeader";
import { clearGraphData, getDashboardGraphs, graphState } from "@/store/Slices/graphSlice";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice";
import { MapIcon } from "@heroicons/react/24/solid";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
        dispatch(getDashboardGraphs('transactions-ranking'));
        // const arrayRanking: ITransactionGraphRequest[] = [];
        // const currentDate = new Date();

        // // All transactions, monthly granularity, for the last year
        // let dateFrom = `${currentDate.getFullYear() - 1}-01-01`;
        // let dateTo = `${currentDate.getFullYear() - 1}-12-31`;

        // const monthlyLastYearCreateRanking: ITransactionGraphRequest = { graphName: `Monthly create ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: stateGraph.zones.slice(0, 1), transactions: ["create"] };
        // arrayRanking.push(monthlyLastYearCreateRanking);

        // //  All transactions, weekly, last 3 months
        // let holderDate = new Date();
        // holderDate.getMonth() - 3;
        // dateFrom = `${holderDate.getFullYear()}-${pad(holderDate.getMonth() - 3)}-01`;
        // dateTo = `${currentDate.getFullYear()}-${pad(currentDate.getMonth())}-${pad(currentDate.getDate())}`;

        // const monthlyThreeMonthsCreateRanking: ITransactionGraphRequest = { graphName: `Monthly create ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, transactions: ["create"] };
        // arrayRanking.push(monthlyThreeMonthsCreateRanking);

        // const monthlyThreeMonthsRenewRanking: ITransactionGraphRequest = { graphName: `Monthly renew ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, transactions: ["renew"] };
        // arrayRanking.push(monthlyThreeMonthsRenewRanking);

        // arrayRanking.forEach(data => {
        //     dispatch(getGraphDataRanking(data));
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
            <title>Registrar Market Comparison</title>
        </Head>
        <Sidebar />

        <MainContent>
            <div className="flex justify-between items-center">
                <PageHeader title="Registrar Comparison Dashboard" subtitle="Compare top registrars based on their recent performance" icon={<MapIcon className="h-16 w-16 text-black dark:text-white" />} />
                {/* <SubmitButton text="Download Report" onClick={() => generatePDF()} /> */}
            </div>
            <DashboardBase state={stateGraph} />
        </MainContent>
        {
            modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />
        }
    </>)
}