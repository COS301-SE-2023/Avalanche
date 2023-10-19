import GraphZoomModal from "@/components/Modals/GraphZoomModal";
import Sidebar from "@/components/Navigation/SideBar";
import { BetterDropdown, DashboardBase, MainContent } from "@/components/Util";
import PageHeader from "@/components/Util/PageHeader";
import { dashboardState, updateColumn } from "@/store/Slices/dashboardSlice";
import { clearGraphData, getDashboardGraphs, graphState } from "@/store/Slices/graphSlice";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice";
import { ChartBarSquareIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Dashboard() {

    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);
    const dashboard = useSelector(dashboardState);

    const setColumns = (value: number) => {
        dispatch(updateColumn(value));
    }

    const loadData = () => {
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
                <div className="hidden lg:block">
                    {stateGraph.graphs.length > 0 && <BetterDropdown items={[{ name: "1 Column", value: 1 }, { name: "2 Columns", value: 2 }]} option={dashboard.columns} set={setColumns} absolute={true} />}
                </div>
            </div>
            <DashboardBase state={stateGraph} />
        </MainContent>
    </>)
}