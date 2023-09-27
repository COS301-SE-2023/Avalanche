import { PlusIcon } from '@heroicons/react/24/solid';
import { NodeProps } from 'reactflow';

interface NodeData {
    click: any,
    clickAnd: any,
    clickOr: any,
};

export default function DDAddNode({ data }: NodeProps<NodeData>) {

    return <div className='flex gap-3'>
        <div className='bg-success-background p-3 rounded flex justify-center items-center cursor-pointer' onClick={data.clickOr}>
            <p className='w-9 h-5 p-0 m-0 flex justify-center items-center'>MATCH ANY</p>
        </div>
        <div className='bg-success-background p-3 rounded flex justify-center items-center cursor-pointer' onClick={data.clickAnd}>
            <p className='w-4 h-4 p-0 m-0 flex justify-center items-center'>AND</p>
        </div>
        <div className='bg-success-background p-3 rounded flex justify-center items-center cursor-pointer' onClick={data.click}>
            <PlusIcon className='w-4 h-4' />
        </div>
    </div>;
}