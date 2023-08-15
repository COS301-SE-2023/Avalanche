import Sidebar from "@/components/Navigation/SideBar";
import { Squares2X2Icon, RectangleStackIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useState, useEffect } from 'react';
import ReactFlow, { applyNodeChanges, MiniMap, Controls, Background, BackgroundVariant, Panel, ReactFlowProvider, ControlButton, useReactFlow, Node, Edge, applyEdgeChanges, OnNodesChange, addEdge, OnEdgesChange, OnConnect, getIncomers, getOutgoers, getConnectedEdges } from 'reactflow';
import 'reactflow/dist/style.css';
import { useRouter } from 'next/router';
import Dagre from '@dagrejs/dagre';

import OutputNode from "@/components/QBee/OutputNode";
const nodeTypes = { outputNode: OutputNode };

const initialNodes = [
    {
        id: 'outputNode',
        type: 'outputNode',
        data: { label: 'Input Node' },
        position: { x: 250, y: 25 },
        deletable: false
    },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3', animated: true },
];

const defaultEdgeOptions = { animated: true };

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export default function QBee() {

    return <ReactFlowProvider><Flow /></ReactFlowProvider>;
}

function Flow() {

    const router = useRouter()

    useEffect(() => {
        onLayout('TB')
    }, [])

    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const { fitView } = useReactFlow();

    const onNodesChange: OnNodesChange = useCallback((changes) => {
        setNodes((nds) => {
            const parsedChanges = changes.reduce((res: any, change: any) => {
                const validChange =
                    change.type !== 'remove' ||
                    (change.type === 'remove' && nds.find(n => n.id === change.id)?.data.deletable);
                if (validChange) {
                    res.push(change);
                }
                return res;
            }, []);

            return applyNodeChanges(parsedChanges, nds);
        });
    }, [setNodes]);

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
        nodes.forEach((node: Node) => g.setNode(node.id, node));

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
                    defaultEdgeOptions={defaultEdgeOptions}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    proOptions={{
                        hideAttribution: true
                    }}
                    nodeTypes={nodeTypes}
                >
                    {/* <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable /> */}
                    <Controls>
                        <ControlButton onClick={() => {
                            onLayout('TB')
                        }}>
                            <RectangleStackIcon className="text-black" />
                        </ControlButton>
                    </Controls>
                    <Background color="#ccc" variant={BackgroundVariant.Dots} />
                    <Panel position="top-right" style={{}} className="bg-black rounded p-2 h-96 w-24">top-right</Panel>
                    <Panel position="top-left" className="bg-black p-2 rounded-lg cursor-pointer" onClick={() => router.push("/home")}><Squares2X2Icon className="w-4=6 h-6" /></Panel>
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    </>
}