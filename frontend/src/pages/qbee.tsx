import Sidebar from "@/components/Navigation/SideBar";
import Head from "next/head";
import Link from "next/link";
import { useState } from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Input Node' },
        position: { x: 250, y: 25 },
    },

    {
        id: '2',
        // you can also pass a React component as a label
        data: { label: <div>Default Node</div> },
        position: { x: 100, y: 125 },
    },
    {
        id: '3',
        type: 'output',
        data: { label: 'Output Node' },
        position: { x: 250, y: 250 },
    },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3', animated: true },
];

export default function QBee() {

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    return <>
        <Head>
            <title>QBee</title>
        </Head>
        <Sidebar />
        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen">
            <div className="w-full h-full">
                <ReactFlow nodes={nodes} edges={edges} fitView />
            </div>
        </div>
    </>
}