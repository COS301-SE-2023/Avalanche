import { Node, NodeProps, Handle, Position, Connection } from 'reactflow';
import { Role as QBeeRole } from "@/interfaces/qbee/enums";
import { PlusIcon } from '@heroicons/react/24/solid';

interface NodeData {
    click: any
};

export default function AddNode({ data }: NodeProps<NodeData>) {

    return <div className='bg-success-background p-3 rounded flex justify-center items-center cursor-pointer' onClick={data.click}>
        <PlusIcon className='w-4 h-4' />
    </div>;
}