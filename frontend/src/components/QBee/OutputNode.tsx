import { useCallback } from 'react';
import { Node, NodeProps, Handle, Position, Connection } from 'reactflow';
import { TableChart } from '../Graphs'
import { useSelector } from 'react-redux';
import { qbeeState } from '@/store/Slices/qbeeSlice';
import { WarningAlert } from '../Util';

type NodeData = {
    jsonData: any
};

type CustomNode = Node<NodeData>;

export default function CustomNode({ data }: NodeProps<NodeData>) {

    // const handles = [
    //     "select", "filter", "group", "choose"
    // ]

    // const renderHandle = () => {
    //     return handles.map((item: string, index: number) => <Handle key={index} type="target" position={Position.Left} id={item} style={{ backgroundColor: "#121212", top: 10 + (index * 15), width: "10px", borderRadius: "0px", height: "10px" }} />)
    // }

    const state = useSelector(qbeeState);

    const newData: any = {
        jsonData: state.outputData
    }
    const qbee = true;

    return <div className='h-full w-full bg-white p-2 rounded border-2 border-avalancheBlue'>
        {/* {renderHandle()} */}
        <Handle
            type="target"
            position={Position.Left}
            isValidConnection={(connection: Connection) => {
                return true;
            }}
        />
        <span className='text-xl text-black'>Results</span>
        {newData.jsonData.length !== 0 ? <div className='h-full w-full'>
            <TableChart data={newData} qbee={qbee} ></TableChart>
        </div> : <WarningAlert title='No Data!' text='Fill out the Select and Filter flows and save to get some data.' />}
    </div>
}