/* eslint-disable @next/next/no-css-tags */
import Sidebar from "@/components/Navigation/SideBar"
import { PencilIcon, CpuChipIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/solid"
import Head from "next/head"
import { CustomChartCard } from "@/components/Graphs"
import { ChartType } from "@/Enums";
import { useDispatch, useSelector } from "react-redux";
import { graphState } from "@/store/Slices/graphSlice"
import { useState, useEffect } from "react";
import { selectModalManagerState, setCurrentOpenState } from "@/store/Slices/modalManagerSlice"
import GraphZoomModal from "@/components/Modals/GraphZoomModal"
import { ErrorToast, Input, SubmitButton, SuccessToast, MainContent } from "@/components/Util"
import GraphCreateModal from "@/components/Modals/GraphCreateModal";
import { getFilters } from "@/store/Slices/graphSlice"
import { userState } from "@/store/Slices/userSlice"
import { Toaster } from "react-hot-toast"
import { useRouter } from "next/router"
import ky, { HTTPError } from "ky"
import { getCookie } from "cookies-next"
import { updateDashboards } from "@/store/Slices/userSlice";
import NoFind from "@/components/CustomSVG/NoFind";
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import 'intro.js/themes/introjs-modern.css';

export default function CreateCustomDashboard() {
    const dispatch = useDispatch<any>();
    const stateGraph = useSelector(graphState);
    const stateUser = useSelector(userState);
    const modalState = useSelector(selectModalManagerState);
    const router = useRouter();

    const [name, setName] = useState<string>("");
    const id = router.query.id as string || document.location.pathname.split("/")[2];
    const [newDash, setNewDash] = useState<boolean>(true);
    const [saved, setSaved] = useState<boolean>(false);
    const [editName, setEditName] = useState<boolean>(false);

    const [graphs, setGraphs] = useState<any>([]);

    const addToGraphs = (graph: any) => {
        const temp = [...graphs];
        temp.push(graph);
        setGraphs(temp);
    }

    useEffect(() => {
        dispatch(getFilters({}));
        setGraphs([]);
        const dash = stateUser.user.dashboards?.find((item: any) => item.dashboardID == id);
        if (!dash) {
            setGraphs([]);
            setName("");
            setNewDash(true);
            setSaved(false);
            return;
        };
        setName(dash.name);
        setGraphs([...dash.graphs]);
        setNewDash(false);
        setSaved(true);
    }, [id])

    // useEffect(() => {
    //     if (!hasCookie("customTutorial")) {
    //         startTut();
    //     }
    // }, []);

    // useEffect(() => {
    //     if (hasCookie("customSaveGraph") && getCookie("customSaveGraph")) {
    //         if (document.getElementsByClassName("grid gap-4 mb-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2")[0]) {
    //             const saveButton = document.getElementsByClassName("flex gap-5 w-full lg:w-max")[0] as HTMLElement
    //             if (saveButton) {
    //                 introJS.exit(true)
    //                 introJS.setOptions({
    //                     steps: [
    //                         {
    //                             element: saveButton,
    //                             intro: "Don't forget to save the dashboard! There you have it, easy as pie"
    //                         }
    //                     ]
    //                 })
    //                 introJS.start()
    //                 deleteCookie("customSaveGraph");
    //                 deleteCookie("customSaveGraph");
    //                 setCookie("customTutorial", false);
    //             }
    //         }
    //     }
    // }, [graphs])

    /**
     * Updates a graph
     * @param graphName 
     * @param endpoint 
     * @param requestObject 
     * @returns 
     */
    const updateGraph = (graphName: string, endpoint: string, requestObject: any) => {

        let temp = [...graphs] as any[];

        const t = temp.findIndex((item: any) => item.graphName === graphName && item.endpointName === endpoint);

        if (t === -1) return;

        let d = { ...temp[t] };
        d["filters"] = requestObject;
        temp[t] = d;

        setGraphs(temp);

    }

    /**
     * Renders the graphs
     */
    const renderGraphs = () => {
        return graphs.map((graph: any, index: number) => <CustomChartCard title={graph.name} defaultGraph={ChartType.Line} data={graph} key={index} state={stateGraph} id={id} updateGraph={updateGraph} />);
    }

    /**
     * Updates dashboard
     */
    const updateDashboard = async () => {

        if (newDash) return ErrorToast({ text: "Something went wrong while creating this dashboard. It seems that it doesn't exist." });

        const dataaaaaaaaa = [] as any;

        graphs.forEach((g: any) => {
            const d: string[] = g?.endpointName?.split("/");
            const warehouse = g?.warehouse || d[0];
            const type = g?.type || d.join("/");
            const gg = {
                endpointName: g?.endpointName,
                graphName: g?.name || g?.graphName,
                filters: g?.filters,
                comments: g?.comments || []
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

    /**
     * Creates a new dashboard
     */
    const createDashboard = async () => {
        if (!newDash) return ErrorToast({ text: 'Something went wrong while creating this dashboard. It seems that it already exists.' });

        if (!name) return ErrorToast({ text: "Your dashboard needs a name" });

        const data = [] as any;

        graphs.forEach((g: any) => {
            const d: string[] = g.endpointName?.split("/");
            const warehouse = g.warehouse || d[0];
            const type = g.type || d.join("/");
            const gg = {
                endpointName: warehouse + "/" + g.type,
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
            setSaved(true);
            return SuccessToast({ text: "Successfully created dashboard." })
        } catch (e) {
            let error = e as HTTPError;
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                return ErrorToast({ text: errorJson.message });
            }
        }
    }

    // const introJS = introJs();
    // const startTut = () => {
    //     introJS.setOptions({
    //         steps: [
    //             {
    //                 intro: 'Welcome! This tutorial will walk you through making you own Custom Dashboard!',
    //                 title: "Custom Dashboard Tutorial"
    //             },
    //             {
    //                 element: document.getElementsByClassName('w-4 h-4 right-0 top-0 hover:cursor-pointer hover:text-avalancheBlue duration-75 hover:scale-125')[0] as HTMLElement,
    //                 intro: 'Here you can choose the name you want for your Dashboard.',
    //             },
    //             {
    //                 element: document.getElementsByClassName("flex gap-5 w-full lg:w-max")[0] as HTMLElement,
    //                 intro: 'This button allows you to add graphs to your Dashboard.',
    //             }
    //         ]
    //     }).start();
    //     setCookie("customGraphTutorial", true);
    // }

    return (<>
        <Head>
            <title>Dashboard</title>
        </Head>
        <Sidebar />
        <Toaster />

        <MainContent>
            <div className="flex justify-between items-center flex-col lg:flex-row">
                <div className="flex flex-row gap-2 items-center">
                    <CpuChipIcon className="h-16 w-16 text-black dark:text-white" />
                    {/* <SubmitButton text="Start tutorial" className="flex-auto" onClick={() => {
                        startTut();
                    }} /> */}
                    <div>
                        {!editName && <h1 className="text-3xl text-gray-900 dark:text-white font-bold flex gap-2"><span>{name ? name : "Custom Dashboard"}</span> <PencilIcon className="w-4 h-4 right-0 top-0 hover:cursor-pointer hover:text-avalancheBlue duration-75 hover:scale-125" onClick={() => setEditName(true)} /></h1>}
                        {editName && <div className="flex gap-4">
                            <Input placeholder="Custom Dashboard" type="text" name="dashboard-name" id="dashboard-name" value={name} required={false} onChange={(event: React.FormEvent<HTMLInputElement>) => setName(event.currentTarget.value)} />
                            <div className="flex flex-col gap-2">
                                <CheckIcon className="w-4 h-4 right-0 top-0 text-gray-800 dark:text-gray-200 hover:cursor-pointer hover:text-green-500 hover:dark:text-green-500 duration-75 hover:scale-125" onClick={() => {
                                    if (!name) {
                                        return ErrorToast({ text: "You need to specify a name." });
                                    }
                                    setEditName(false);
                                }} />
                                <XMarkIcon className="w-4 h-4 right-0 top-0 text-gray-800 dark:text-gray-200 hover:cursor-pointer hover:text-red-500 hover:dark:text-red-500 duration-75 hover:scale-125" onClick={() => {
                                    setEditName(false);
                                    setName("");
                                }} />
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="flex gap-5 w-full lg:w-max">
                    {graphs.length > 0 && saved && <SubmitButton text="Update Dashboard" className="flex-auto" onClick={() => {
                        updateDashboard();
                    }} />}
                    {graphs.length > 0 && newDash && !saved && <SubmitButton text="Create Dashboard" className="flex-auto" onClick={() => {
                        createDashboard();
                    }} />}
                    <SubmitButton text="Add a Graph" onClick={() => {
                        dispatch(setCurrentOpenState("GRAPH.AddGraph"))
                    }} />
                </div>
            </div>
            <div className="p-0 pt-4 md:p-4">
                {graphs.length === 0 ? <div className="flex justify-center flex-col items-center h-[calc(100vh-24rem)]">
                    <NoFind className="h-48 w-48" />
                    <h3 className="text-3xl font-medium text-gray-700 dark:text-white">No graphs found...</h3>
                    <p className='text-xl text-gray-600 dark:text-gray-400'>No graphs exist yet... Get graphing!</p>
                </div> : <div className="grid gap-4 mb-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    {renderGraphs()}
                </div>}
            </div>
        </MainContent>

        {/* Modals */}
        {modalState.currentOpen === "GRAPH.AddGraph" && <GraphCreateModal state={stateGraph} add={addToGraphs} />}
        {modalState.currentOpen === "GRAPH.Modal" && <GraphZoomModal custom={true} />}

    </>)
}