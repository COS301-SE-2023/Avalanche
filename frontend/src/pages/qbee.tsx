import { Squares2X2Icon, CheckCircleIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useState, useEffect } from 'react';
import ReactFlow, { applyNodeChanges, Controls, Background, BackgroundVariant, Panel, ReactFlowProvider, useReactFlow, Node, Edge, applyEdgeChanges, OnNodesChange, addEdge, OnEdgesChange, OnConnect, Connection, } from 'reactflow';
import 'reactflow/dist/style.css';
import { useRouter } from 'next/router';
import Dagre from '@dagrejs/dagre';
import { v4 as uuidv4 } from 'uuid';
import { randomRange } from "@/utils";
import { Role as QBeeRole } from "@/interfaces/qbee/enums";
import { DBData } from "@/interfaces/qbee/interfaces";
import { SubmitButton, SuccessToast } from "@/components/Util";
import { useDispatch } from "react-redux";
import { addData } from "@/store/Slices/qbeeSlice";

import OutputNode from "@/components/QBee/OutputNode";
import SelectBlock from "@/components/QBee/SelectNode";
import EdgeNode from "@/components/QBee/EdgeNode";
import AddNode from "@/components/QBee/AddNode";
import FilterBlock from "@/components/QBee/FilterBlock";

import dummyData from "@/components/QBee/dummy.json";
import { Toaster } from "react-hot-toast";

const nodeTypes = { outputNode: OutputNode, selectBlock: SelectBlock, edgeNode: EdgeNode, addNode: AddNode, filterBlock: FilterBlock };

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export default function QBee() {

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const handleResize = () => {
        setScreenWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (screenWidth > 768) return <div><ReactFlowProvider><Toaster /><Flow /></ReactFlowProvider></div>;
    return <>
        <Head>
            <title>🐝</title>
        </Head>
        <Link href="/home" className="fixed top-5 left-5 bg-black p-2 rounded-lg cursor-pointer dark:bg-white dark:text-primaryBackground"><Squares2X2Icon className="w-6 h-6" /></Link>
        <section className="bg-gray-50 dark:bg-primaryBackground h-screen">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 md:h-screen flex justify-center items-center h-full">
                <div className="mx-auto max-w-screen-sm text-center">
                    <img src="https://astonmartin.sloththe.dev/isawesome/undraw_mobile_encryption_re_yw3o.svg" />
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-avalancheBlue dark:text-avalancheBlue">Whoops</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">No mobile devices...</p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">For Q🐝, you need to access this on a tablet or a bigger device such as a desktop PC or laptop.</p>
                    <Link href="/home" className="inline-flex text-white bg-avalancheBlue hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back to Homepage</Link>
                </div>
            </div>
        </section>
    </>
}

function Flow() {

    /**
     * Holds the initial nodes for the Flow
     */
    const initialNodes: Node[] = [
        // ---- Start of Select Area
        {
            id: "SelectGroup",
            type: "group",
            position: { x: 0, y: 0 },
            style: {
                width: 2000,
                height: 500
            },
            data: {},
            deletable: false,
            draggable: true,
        },
        {
            id: "selectStart",
            extent: "parent",
            parentNode: "SelectGroup",
            position: { x: -75, y: 50 },
            data: {
                label: "Start of Select",
                role: QBeeRole.startOfSelect,
                connectTo: [QBeeRole.selectBlock],
                handles: {
                    source: {}
                }
            },
            draggable: false,
            deletable: false,
            type: "edgeNode",
        },
        {
            id: "selectEnd",
            extent: "parent",
            parentNode: "SelectGroup",
            position: { x: 1930, y: 50 },
            type: "edgeNode",
            data: {
                label: "End of Select",
                role: QBeeRole.endOfSelect,
                connectTo: [QBeeRole.startOfFilter],
                handles: {
                    target: {},
                    source: {}
                }
            },
            deletable: false,
            draggable: false,
        },
        {
            id: "selectAdd",
            position: { x: 1980, y: -20 },
            data: {
                click: () => addSelectNode()
            },
            type: 'addNode',
            extent: 'parent',
            parentNode: 'SelectGroup',
            deletable: false,
            draggable: false,
        },
        // ---- End of Select Area
        // ---- Start of Filter Area
        {
            id: "FilterGroup",
            type: "group",
            position: { x: 2300, y: 0 },
            style: {
                width: 1000,
                height: 500
            },
            data: {},
            deletable: false,
            draggable: true,
        },
        {
            id: "filterStart",
            extent: "parent",
            parentNode: "FilterGroup",
            position: { x: -75, y: 50 },
            data: {
                label: "Start of Filter",
                role: QBeeRole.startOfFilter,
                connectTo: [QBeeRole.filterBlock],
                handles: {
                    source: {},
                    target: {}
                }
            },
            draggable: false,
            deletable: false,
            type: "edgeNode",
        },
        {
            id: "filterEnd",
            extent: "parent",
            parentNode: "FilterGroup",
            position: { x: 930, y: 50 },
            type: "edgeNode",
            data: {
                label: "End of Filter",
                role: QBeeRole.endOfFilter,
                connectTo: [QBeeRole.outputBlock],
                handles: {
                    target: {},
                    source: {}
                }
            },
            deletable: false,
            draggable: false,
        },
        {
            id: "filterAdd",
            position: { x: 980, y: -20 },
            data: {
                click: () => addFilterNode()
            },
            type: 'addNode',
            extent: 'parent',
            parentNode: 'FilterGroup',
            deletable: false,
            draggable: false,
        },
        // ---- End of Filter Area
        // ---- Start of Output
        {
            id: "OutputGroup",
            type: "group",
            position: { x: 3600, y: 0 },
            style: {
                width: 1000,
                height: 500
            },
            data: {},
            deletable: false,
            draggable: true,
        },
        {
            id: "outputStart",
            extent: "parent",
            parentNode: "OutputGroup",
            position: { x: -75, y: 50 },
            data: {
                label: "In for the Output",
                role: QBeeRole.startOfOutput,
                connectTo: [],
                handles: {
                    target: {}
                }
            },
            draggable: false,
            deletable: false,
            type: "edgeNode",
        },
    ];

    /**
     * Holds the initial edges for the flow
     */
    const initialEdges: Edge[] = [
        {
            id: "selectToFilter",
            source: QBeeRole.endOfSelect,
            target: QBeeRole.startOfFilter,
            deletable: false,
        },
        {
            id: "filterToOutput",
            source: QBeeRole.endOfFilter,
            target: QBeeRole.startOfOutput,
            deletable: false,
        }
    ];

    /**
     * Adds a select node to the select subflow
     */
    const addSelectNode = (): void => {
        setNodes((nds) => nds.concat({
            id: `${QBeeRole.selectBlock}-${uuidv4()}`,
            type: QBeeRole.selectBlock,
            extent: 'parent',
            parentNode: 'SelectGroup',
            data: {
                label: "",
                column: "",
                typeOfColumn: "",
                help: "",
                aggregationType: "",
                renamedColumn: "",
                connectTo: [QBeeRole.selectBlock, QBeeRole.endOfSelect],
                quickConnect: quickConnect
            },
            position: { x: randomRange(350, 750), y: randomRange(150, 350) },
            zIndex: 2
        }));
    }

    /**
     * Adds a filter node to the filter subflow
     */
    const addFilterNode = (): void => {
        setNodes((nds) => nds.concat({
            id: `${QBeeRole.filterBlock}-${uuidv4()}`,
            type: QBeeRole.filterBlock,
            extent: 'parent',
            parentNode: 'FilterGroup',
            data: {
                label: "",
                column: "",
                typeOfColumn: "",
                help: "",
                aggregationType: "",
                renamedColumn: "",
                connectTo: [QBeeRole.filterBlock, QBeeRole.endOfFilter]
            },
            position: { x: randomRange(350, 750), y: randomRange(150, 350) },
        }));
    }

    const quickConnect = (from: string, to: string): void => {
        setEdges((edgs: Edge[]) => edgs.concat({
            id: `${from}-${to}-${uuidv4()}`,
            source: from,
            target: to,
        }));
    }

    const router = useRouter();
    const dispatch = useDispatch<any>();
    dispatch(addData(dummyData as DBData[]));
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [selectedPanel, setSelectedPanel] = useState<string>("blocks");
    const { fitView } = useReactFlow();

    /**
     * I use this for when I have to render that side block with the options
     */
    useEffect(() => {
        const node = nodes.find(item => item.selected);
        if (node?.id === "SelectGroup") setSelectedPanel(node.id);
        if (node?.id === "FilterGroup") setSelectedPanel(node.id);
        if (node?.type === "outputNode") setSelectedPanel(node.type);
        if (node === null || node === undefined) setSelectedPanel("blocks");

    }, [nodes]);

    // Runs when Nodes are added/removed/updated/changed
    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );

    // Runs when Edges are changed/updated/added/removed
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    // When a node connects
    const onConnect: OnConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    /**
     * Used for the layouting nicely of elements, but this is scuffed with the subflow, so it is disabled for now
     * @param nodes 
     * @param edges 
     * @param options 
     * @returns 
     */
    const getLayoutedElements = (nodes: Node[], edges: Edge[], options: any) => {
        g.setGraph({ rankdir: options.direction });

        edges.forEach((edge: Edge) => g.setEdge(edge.source, edge.target));
        nodes.forEach((node: Node) => g.setNode(node.id, node as any));

        Dagre.layout(g);

        return {
            nodes: nodes.map((node: Node) => {
                const { x, y } = g.node(node.id);

                return { ...node, position: { x, y } };
            }),
            edges,
        };
    };

    /**
     * Used for the layouting nicely of elements, but this is scuffed with the subflow, so it is disabled for now
     */
    const onLayout = useCallback(
        (direction: string) => {
            const layouted = getLayoutedElements(nodes, edges, { direction });
            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);
            fitView();
        },
        [nodes, edges]
    );

    return <>
        <Head>
            <title>QBee</title>
        </Head>
        <div className="bg-gray-100 dark:bg-secondaryBackground h-screen w-screen">
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    defaultEdgeOptions={{ animated: true, zIndex: 1 }}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    proOptions={{
                        hideAttribution: true
                    }}
                    nodeTypes={nodeTypes}
                    defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
                >
                    <Controls />
                    <Background color="#ccc" variant={BackgroundVariant.Dots} />
                    {selectedPanel === "SelectGroup" && <Panel position="top-right" style={{}} className="bg-black rounded p-4 h-fit">
                        <h4 className="text-white underline text-xl mb-2">Select Area</h4>
                        <p className="text-white mb-2 max-w-xs">This is the select area. Anything that you need to select shows up in this area.</p>
                        <SubmitButton
                            text="Add a Select Block"
                            className="w-full"
                            onClick={() => addSelectNode()} />
                    </Panel>}
                    {selectedPanel === "FilterGroup" && <Panel position="top-right" style={{}} className="bg-black rounded p-4 h-fit">
                        <h4 className="text-white underline text-xl mb-2">Filter Area</h4>
                        <p className="text-white mb-2 max-w-xs">This is the filter area. Anything that you need to filter shows up in this area.</p>
                        <SubmitButton
                            text="Add a Filter Block"
                            className="w-full"
                            onClick={() => addFilterNode()} />
                    </Panel>}
                    <Panel position="top-left" className="flex gap-2 flex-col">
                        <div className="bg-black p-2 rounded-lg cursor-pointer" onClick={() => router.push("/home")}>
                            <Squares2X2Icon className="w-4=6 h-6" />
                        </div>
                        <div className="bg-success-background p-2 rounded-lg cursor-pointer" onClick={() => SuccessToast({ text: "Successfully saved 🐝 Or have you 👀" })}>
                            <CheckCircleIcon className="w-4=6 h-6" />
                        </div>
                    </Panel>
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    </>
}