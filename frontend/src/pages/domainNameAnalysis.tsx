import GraphZoomModal from "@/components/Modals/GraphZoomModal";
import Sidebar from "@/components/Navigation/SideBar";
import { BetterDropdown, DashboardBase, MainContent } from "@/components/Util";
import PageHeader from "@/components/Util/PageHeader";
import { dashboardState, updateColumn } from "@/store/Slices/dashboardSlice";
import { clearGraphData, getDashboardGraphs, graphState } from "@/store/Slices/graphSlice";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice";
import { EyeIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DomainNameAnalysis() {

    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);
    const dashboard = useSelector(dashboardState);

    const setColumns = (value: number) => {
        dispatch(updateColumn(value));
    }

    const loadData = () => {
        dispatch(getDashboardGraphs('domainNameAnalysis/count'));
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
                {stateGraph.graphs.length > 0 && <BetterDropdown items={[{ name: "1 Column", value: 1 }, { name: "2 Columns", value: 2 }]} option={dashboard.columns} set={setColumns} />}
            </div>
            <DashboardBase state={stateGraph} />
        </MainContent>
        {
            modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />
        }
    </>)
}