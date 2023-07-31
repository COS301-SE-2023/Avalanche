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
import { ErrorToast, SubmitButton, SuccessToast } from "@/components/Util"
import GraphCreateModal from "@/components/Modals/GraphCreateModal";
import { getFilters } from "@/store/Slices/graphSlice"
import { userState } from "@/store/Slices/userSlice"
import { Toaster } from "react-hot-toast"
import { useRouter } from "next/router"
import ky, { HTTPError } from "ky"
import { getCookie } from "cookies-next"
import { updateDashboards } from "@/store/Slices/userSlice"

export default function CreateCustomDashboard() {
    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const stateUser = useSelector(userState);
    const modalState = useSelector(selectModalManagerState);
    const router = useRouter();

    const [name, setName] = useState<string>(router.query.name as string || "");
    const [id, setID] = useState<string>(router.query.id as string || document.location.pathname.split("/")[2]);
    const [newDash, setND] = useState<boolean>(true);

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
        if (!name) {
            setND(false);
            const dash = stateUser.user.dashboards.find((item: any) => item.dashboardID == id);
            if (!dash) {
                return ErrorToast({ text: "This dashboard does not exist." })
            };
            setName(dash.name);
            setGraphs(dash.graphs);
        }
    }, [stateUser]);


    const renderGraphs = () => {
        return graphs.map((graph: any, index: number) => {
            return <CustomChartCard title={graph.name} defaultGraph={ChartType.Pie} data={graph} key={index} state={stateGraph} id={id} />
        })
    }

    const saveDashboard = async () => {

        const dataaaaaaaaa = [] as any;

        graphs.forEach((g: any) => {
            const d = g.endpointName?.split("/");
            const warehouse = g.warehouse || d[0];
            const type = g.type || d[1];
            const gg = {
                endpointName: warehouse + "/" + type,
                graphName: g.name || g.graphName,
                filters: g.filters,
            };
            dataaaaaaaaa.push(gg);
        });

        const boo = {
            name: name,
            dashboardID: id,
            graphs: dataaaaaaaaa
        }

        try {
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/${newDash ? "saveDashboard" : "editDashboard"}`, {
                json: boo,
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json() as any;
            dispatch(updateDashboards(res.message));
            return SuccessToast({ text: `Successfully ${newDash ? "saved" : "updated"} dashboard.` })
        } catch (e) {
            let error = e as HTTPError;
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                return ErrorToast({ text: errorJson.message });
            }
        }

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
        {modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal custom={true} />}
    </>)
}