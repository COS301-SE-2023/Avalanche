import Sidebar from "@/components/Navigation/SideBar";
import PageHeader from "@/components/Util/PageHeader";
import { BoltIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { graphState, clearGraphData, getDashboardGraphs } from "@/store/Slices/graphSlice";
import { useEffect } from "react";
import { selectModalManagerState } from "@/store/Slices/modalManagerSlice";
import GraphZoomModal from "@/components/Modals/GraphZoomModal";
import { BetterDropdown, DashboardBase, MainContent } from "@/components/Util";
import { dashboardState, updateColumn } from "@/store/Slices/dashboardSlice";

export default function Movement() {

    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);
    const dashboard = useSelector(dashboardState);

    const setColumns = (value: number) => {
        dispatch(updateColumn(value));
    }

    const loadData = () => {
        dispatch(getDashboardGraphs('movement/vertical'));
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
                <PageHeader title="Nett Movement" subtitle="View the vertical movement of domains in your space" icon={<BoltIcon className="h-16 w-16 text-black dark:text-white" />} />
                <div className="hidden md:visisble">
                    {stateGraph.graphs.length > 0 && <BetterDropdown items={[{ name: "1 Column", value: 1 }, { name: "2 Columns", value: 2 }]} option={dashboard.columns} set={setColumns} absolute={true} />}
                </div>
            </div>
            <DashboardBase state={stateGraph} />
        </MainContent>
        {
            modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />
        }
    </>)
}