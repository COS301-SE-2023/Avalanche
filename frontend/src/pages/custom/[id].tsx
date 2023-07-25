import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { HomeIcon, PencilSquareIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { ChartCard, CustomChartCard } from "@/components/Graphs"
import { ChartType } from "@/Enums";
import { useDispatch, useSelector } from "react-redux";
import { graphState, getGraphData, getGraphDataRanking } from "@/store/Slices/graphSlice"
import { useState, useEffect } from "react";
import { ITransactionGraphRequest } from "@/interfaces/requests";
import { selectModalManagerState, setCurrentOpenState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import { SubmitButton } from "@/components/Util"
import GraphCreateModal from "@/components/Modals/GraphCreateModal";
import { getFilters } from "@/store/Slices/graphSlice"
import { Toaster } from "react-hot-toast"
import { useRouter } from "next/router"
import ky from "ky"
import { getCookie } from "cookies-next"

export default function CreateCustomDashboard() {
    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const modalState = useSelector(selectModalManagerState);
    const router = useRouter();

    const name = router.query.name;
    const id = router.query.id;

    const [graphs, setGraphs] = useState<any>([]);

    const addToGraphs = (graph: any) => {
        const temp = [...graphs];
        temp.push(graph);
        setGraphs(temp);
    }

    useEffect(() => {
        dispatch(getFilters({}));
    }, []);

    useEffect(() => {
        // renderGraphs();
    }, [graphs]);


    const renderGraphs = () => {
        return graphs.map((graph: any, index: number) => {
            return <CustomChartCard title={graph.name} defaultGraph={ChartType.Pie} data={graph} key={index} state={stateGraph} />
        })
    }

    const saveDashboard = async () => {
        console.log(graphs);

        /**
         * filters: {}
         * name: "" // graph name
         * type: "" // type of graph
         * warehouse: "" // warehouse
         */

        const dataaaaaaaaa = [] as any;

        graphs.forEach((g: any) => {
            const gg = {
                endpointName: g.warehouse + "/" + g.type,
                graphName: g.name,
                filters: g.filters,
            };
            dataaaaaaaaa.push(gg);
        });

        const boo = {
            name: name,
            dashboardID: id,
            graphs: dataaaaaaaaa
        }

        console.log(boo);

        await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/saveDashboard`, {
            json: boo,
            headers: {
                "Authorization": `Bearer ${getCookie("jwt")}`
            }
        })
    }

    return (<>
        <Head>
            <title>Dashboard</title>
        </Head>
        <Sidebar />
        <Toaster />

        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Custom Dashboard" subtitle={`${name}`} icon={<PencilSquareIcon className="h-16 w-16 text-black dark:text-white" />} />
                <div className="flex gap-5">
                    {graphs.length > 0 && <SubmitButton text="Save Dashboard" onClick={() => {
                        saveDashboard();
                    }} />}
                    <SubmitButton text="Add a graph" onClick={() => {
                        dispatch(setCurrentOpenState("GRAPH.AddGraph"))
                    }} />
                </div>
            </div>
            <div className="p-0 pt-4 md:p-4">
                <div className="grid lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-4 mb-4 grid-rows-2">
                    {renderGraphs()}
                </div>
            </div>
        </div>

        {/* Modals */}
        {modalState.currentOpen === "GRAPH.AddGraph" && <GraphCreateModal state={stateGraph} add={addToGraphs} />}
        {modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal />}
    </>)
}