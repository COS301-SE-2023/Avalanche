import Sidebar from "@/components/Navigation/SideBar";
import { Squares2X2Icon, RectangleStackIcon, PlusIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useState, useEffect } from 'react';
import ReactFlow, { applyNodeChanges, MiniMap, Controls, Background, BackgroundVariant, Panel, ReactFlowProvider, ControlButton, useReactFlow, Node, Edge, applyEdgeChanges, OnNodesChange, addEdge, OnEdgesChange, OnConnect, getIncomers, getOutgoers, getConnectedEdges, FitView, useOnSelectionChange } from 'reactflow';
import 'reactflow/dist/style.css';
import { useRouter } from 'next/router';
import Dagre from '@dagrejs/dagre';
import { v4 as uuidv4 } from 'uuid';

import OutputNode from "@/components/QBee/OutputNode";
import SelectBlock from "@/components/QBee/SelectNode";
import EdgeNode from "@/components/QBee/EdgeNode";
import { Role as QBeeRole } from "@/interfaces/qbee/enums";
import { SubmitButton } from "@/components/Util";

const nodeTypes = { outputNode: OutputNode, selectBlock: SelectBlock, edgeNode: EdgeNode };

const initialNodes: Node[] = [
    {
        id: "SelectGroup",
        type: "group",
        position: { x: 0, y: 0 },
        style: {
            width: 1000,
            height: 500
        },
        data: {}
    },
    // {
    //     id: "FilterGroup",
    //     type: "group",
    //     position: { x: 500, y: 0 },
    //     style: {
    //         width: 400, height: 200
    //     },
    //     data: {}
    // },
    {
        id: "SelectStart",
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
        id: "SelectEnd",
        extent: "parent",
        parentNode: "SelectGroup",
        position: { x: 930, y: 50 },
        type: "edgeNode",
        data: {
            label: "End of Select",
            role: QBeeRole.endOfSelect,
            connectTo: [QBeeRole.startOfilter],
            handles: {
                target: {},
                source: {}
            }
        },
        draggable: false,
    }
];

const initialEdges: Edge[] = [

];

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export default function QBee() {

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const router = useRouter()

    const handleResize = () => {
        setScreenWidth(window.innerWidth);
    };

    useEffect(() => {
        // Add event listener to update dimensions on window resize
        window.addEventListener('resize', handleResize);

        // Cleanup by removing event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (screenWidth > 768) return <div><ReactFlowProvider><Flow /></ReactFlowProvider></div>;
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

    const router = useRouter();
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [selectedPanel, setSelectedPanel] = useState<string>("blocks");
    const { fitView } = useReactFlow();

    useEffect(() => {
        // console.log(nodes);

        const node = nodes.find(item => item.selected);

        console.log(node);

        if (node?.id === "SelectGroup") setSelectedPanel(node.id);
        if (node?.type === "outputNode") setSelectedPanel(node.type);
        if (node === null || node === undefined) setSelectedPanel("blocks");

    }, [nodes])

    // Runs when Nodes are added/removed/updated/changed
    const onNodesChange: OnNodesChange = useCallback(
        (changes) => {
            setNodes((nds) => applyNodeChanges(changes, nds))
        },
        [setNodes]
    );

    // Runs when Edges are changed/updated/added/removed
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

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
                    defaultEdgeOptions={{ animated: true }}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    proOptions={{
                        hideAttribution: true
                    }}
                    nodeTypes={nodeTypes}
                    defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
                >
                    <Controls>
                        {/* <ControlButton onClick={() => {
                            onLayout('LR')
                        }}>
                            <RectangleStackIcon className="text-black" />
                        </ControlButton> */}
                    </Controls>
                    <Background color="#ccc" variant={BackgroundVariant.Dots} />
                    <Panel position="top-right" style={{}} className="bg-black rounded p-4 h-fit">
                        {selectedPanel === "SelectGroup" && <>
                            <h4 className="text-white underline text-xl mb-2">Select Area</h4>
                            <p className="text-white mb-2 max-w-xs">This is the select area. Anything that you need to select shows up in this area.</p>
                            <SubmitButton
                                text="Add a Select Block"
                                className="w-full"
                                onClick={() => {
                                    const newNode: Node = {
                                        id: `selectBlock-${uuidv4()}`,
                                        type: 'selectBlock',
                                        extent: 'parent',
                                        parentNode: 'SelectGroup',
                                        data: {
                                            label: "",
                                            column: "",
                                            typeOfColumn: "",
                                            help: "",
                                            aggregationType: "",
                                            renamedColumn: "",
                                            connectTo: [QBeeRole.selectBlock, QBeeRole.endOfSelect]
                                        },
                                        position: { x: 0, y: 0 },
                                    };
                                    setNodes((nds) => nds.concat(newNode));
                                }} />
                        </>}
                        {/* {selectedPanel === "blocks" && <>
                            <h4 className="text-white underline text-xl mb-4">Blocks</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="block max-w-xs p-4 bg-white border border-gray-200 rounded shadow  dark:bg-gray-800 dark:border-gray-700 relative" draggable={true}>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Select</h5>
                                    <p className="font-normal text-gray-700 dark:text-gray-400">Something to do with Select</p>
                                    <span className={`absolute -top-3 -right-3 duration-75 rounded-full p-1 border-white border-4 text-white ${nodes.find(item => item.type === "selectBlock") ? "bg-gray-400" : "bg-green-500 hover:bg-green-600 cursor-pointer"}`} onClick={() => {
                                        if (!nodes.find(item => item.type === "selectBlock")) {
                                            const newNode: Node = {
                                                id: 'selectBlock',
                                                type: 'selectBlock',
                                                extent: 'parent',
                                                parentNode: 'SelectGroup',
                                                data: {
                                                    connectTo: [QBeeRole.selectBlock, QBeeRole.endOfSelect]
                                                },
                                                position: { x: 0, y: 0 },
                                            };
                                            setNodes((nds) => nds.concat(newNode));
                                        }
                                    }}><PlusIcon className="w-5 h-5" /></span>
                                </div>
                            </div>
                        </>}
                        {selectedPanel === "selectBlock" && <>
                            <h4 className="text-white underline text-xl mb-4">selectBlock</h4>
                            <p className="text-white">Options should be changed from within the block, not on this panel.</p>
                        </>} */}
                    </Panel>
                    <Panel position="top-left" className="bg-black p-2 rounded-lg cursor-pointer" onClick={() => router.push("/home")}><Squares2X2Icon className="w-4=6 h-6" /></Panel>
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    </>
}