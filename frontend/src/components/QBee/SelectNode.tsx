import { useCallback } from 'react';
import { Node, NodeProps, Handle, Position } from 'reactflow';

type NodeData = {
    title: string
};

type CustomNode = Node<NodeData>;

export default function SelectNode({ data }: NodeProps<NodeData>) {

    const handles: any[] = [

    ]

    const renderHandle = () => {
        return handles.map((item: string, index: number) => <Handle type="target" position={Position.Left} id={item} style={{ backgroundColor: "#121212", top: 10 + (index * 15), width: "10px", borderRadius: "0px", height: "10px" }} />)
    }

    return <div className='bg-avalancheBlue p-3 pl-5 rounded'>
        {renderHandle()}
        <div>
            <Handle type="source" position={Position.Right} id="outHandle" style={{ backgroundColor: "#121212", width: "10px", borderRadius: "0px", height: "10px" }} />
            <span className='text-xl'>Select</span>

        </div>
    </div>
}