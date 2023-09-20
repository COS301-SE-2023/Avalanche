import { useCallback } from 'react';
import { Node, NodeProps, Handle, Position , Connection } from 'reactflow';
import {TableChart} from '../Graphs'

type NodeData = {
    jsonData: any
};

type CustomNode = Node<NodeData>;

export default function CustomNode({ data }: NodeProps<NodeData>) {
    console.log('In output node')
    console.log(data)

    // const handles = [
    //     "select", "filter", "group", "choose"
    // ]

    // const renderHandle = () => {
    //     return handles.map((item: string, index: number) => <Handle key={index} type="target" position={Position.Left} id={item} style={{ backgroundColor: "#121212", top: 10 + (index * 15), width: "10px", borderRadius: "0px", height: "10px" }} />)
    // }
    const newData: any = {
        jsonData: data.jsonData
    }
    const qbee = true;

    return <div className='h-full w-full'>
        {/* {renderHandle()} */}
        <Handle
            type="target"
            position={Position.Left}
            isValidConnection={(connection: Connection) => {
                return true;
            }}
        />
        <span className='text-xl'>Results</span>
        <div className='h-80 w-full'>
        <TableChart data={newData} qbee={qbee} ></TableChart>
        </div>
    </div>
}