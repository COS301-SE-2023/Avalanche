import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { HomeIcon, PencilSquareIcon, PencilIcon, CpuChipIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { ChartCard, CustomChartCard } from "@/components/Graphs"
import { ChartType } from "@/Enums";
import { useDispatch, useSelector } from "react-redux";
import { graphState, getGraphData, getGraphDataRanking } from "@/store/Slices/graphSlice"
import { useState, useEffect } from "react";
import { ITransactionGraphRequest } from "@/interfaces/requests";
import { selectModalManagerState, setCurrentOpenState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import { ErrorToast, Input, SubmitButton, SuccessToast } from "@/components/Util"
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

    const [name, setName] = useState<string>("");
    const id = router.query.id as string || document.location.pathname.split("/")[2];
    const [newDash, setNewDash] = useState<boolean>(true);
    const [editName, setEditName] = useState<boolean>(false);

    const [graphs, setGraphs] = useState<any>([]);

    const addToGraphs = (graph: any) => {
        const temp = [...graphs];
        temp.push(graph);
        setGraphs(temp);
    }

    useEffect(() => {
        setGraphs([]);
        const dash = stateUser.user.dashboards?.find((item: any) => item.dashboardID == id);
        console.log(dash);
        if (!dash) {
            setGraphs([]);
            setNewDash(true);
            return;
        };
        setGraphs([...dash.graphs]);
        setNewDash(false);
    }, [id])

    const renderGraphs = () => {
        return graphs.map((graph: any, index: number) => <CustomChartCard title={graph.name} defaultGraph={ChartType.Pie} data={graph} key={index} state={stateGraph} id={id} />);
    }

    const updateDashboard = async () => {

        if (newDash) return ErrorToast({ text: "Something went wrong while creating this dashboard. It seems that it doesn't exist." });

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

    const createDashboard = async () => {
        if (!newDash) return ErrorToast({ text: 'Something went wrong while creating this dashboard. It seems that it already exists.' });

        if (!name) return ErrorToast({ text: "Your dashboard needs a name" });

        const data = [] as any;

        graphs.forEach((g: any) => {
            const d = g.endpointName?.split("/");
            const warehouse = g.warehouse || d[0];
            const type = g.type || d[1];
            const gg = {
                endpointName: warehouse + "/" + type,
                graphName: g.name || g.graphName,
                filters: g.filters,
            };
            data.push(gg);
        });

        const boo = {
            name: name,
            dashboardID: id,
            graphs: data
        }

        try {
            const res = await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/saveDashboard`, {
                json: boo,
                headers: {
                    "Authorization": `Bearer ${getCookie("jwt")}`
                }
            }).json() as any;
            dispatch(updateDashboards(res.message));
            return SuccessToast({ text: "Successfully created dashboard." })
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
                {/* <PageHeader title="Custom Dashboard" subtitle={id} icon={<PencilSquareIcon className="h-16 w-16 text-black dark:text-white" />} /> */}
                <div className="flex flex-row gap-2 items-center">
                    <CpuChipIcon className="h-16 w-16 text-black dark:text-white" />
                    <div>
                        {!editName && <h1 className="text-3xl text-gray-900 dark:text-white font-bold flex gap-2"><span>{name ? name : "Custom Dashboard"}</span> <PencilIcon className="w-4 h-4 right-0 top-0 hover:cursor-pointer hover:text-avalancheBlue duration-75 hover:scale-125" onClick={() => setEditName(true)} /></h1>}
                        {editName && <div className="flex gap-4">
                            <Input placeholder="Custom Dashboard" type="text" name="dashboard-name" id="dashboard-name" value={name} required={false} onChange={(event: React.FormEvent<HTMLInputElement>) => setName(event.currentTarget.value)} />
                            <div className="flex flex-col gap-2">
                                <CheckIcon className="w-4 h-4 right-0 top-0 hover:cursor-pointer hover:text-green-500 duration-75 hover:scale-125" onClick={() => {
                                    if (!name) {
                                        return ErrorToast({ text: "You need to specify a name." });
                                    }
                                    setEditName(false);
                                }} />
                                <XMarkIcon className="w-4 h-4 right-0 top-0 hover:cursor-pointer hover:text-red-500 duration-75 hover:scale-125" onClick={() => {
                                    setEditName(false);
                                    setName("");
                                }} />
                            </div>
                        </div>}
                        <p className="text-lg text-gray-400">{id}</p>
                    </div>
                </div>
                <div className="flex gap-5">
                    {graphs.length > 0 && !newDash && <SubmitButton text="Update Dashboard" onClick={() => {
                        updateDashboard();
                    }} />}
                    {graphs.length > 0 && newDash && <SubmitButton text="Create Dashboard" onClick={() => {
                        createDashboard();
                    }} />}
                    <SubmitButton text="Add a Graph" onClick={() => {
                        dispatch(setCurrentOpenState("GRAPH.AddGraph"))
                    }} />
                </div>
            </div>
            <div className="p-0 pt-4 md:p-4">
                <div className="grid gap-4 mb-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {renderGraphs()}
                </div>
            </div>
        </div>

        {/* Modals */}
        {modalState.currentOpen === "GRAPH.AddGraph" && <GraphCreateModal state={stateGraph} add={addToGraphs} />}
        {modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal custom={true} />}
    </>)
}