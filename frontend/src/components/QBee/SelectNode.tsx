import { Node, NodeProps, Handle, Position } from 'reactflow';
import { SelectBlock } from '@/interfaces/qbee/interfaces';

interface NodeData {
    title: string
};

export default function SelectBlock({ data }: NodeProps<NodeData>) {
    return <div className='bg-avalancheBlue p-3 rounded'>
        <div>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <span className='text-xl'>Select</span>
        </div>
    </div>
}