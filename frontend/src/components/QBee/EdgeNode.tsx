import { Node, NodeProps, Handle, Position, Connection } from 'reactflow';
import { Role as QBeeRole } from "@/interfaces/qbee/enums";

interface NodeData {
    label: string,
    handles?: any
    role: QBeeRole,
    connectTo: string,
};

export default function EdgeNode({ data }: NodeProps<NodeData>) {

    return <div className='bg-avalancheBlue p-3 rounded'>
        <>
            {data.handles?.source && <Handle
                type="source"
                position={Position.Right}
                isValidConnection={(connection: Connection) => {
                    console.log(connection?.target?.split("-")[0], data.connectTo)

                    if (connection?.target?.split("-")[0]) {
                        if (!data.connectTo.includes(connection?.target?.split("-")[0] as string)) {
                            console.log("false 1");
                            return false
                        }
                    } else {
                        if (!data.connectTo.includes(connection?.target as string)) {
                            console.log("false 2");
                            return false;
                        };
                    }

                    return true;
                }}
            />}
            {data.handles?.target && <Handle
                type="target"
                position={Position.Left}
                isValidConnection={(connection) => {
                    if (!data.connectTo.includes(connection?.target as string)) return false;
                    return true;
                }}
            />}
        </>
        <span className='text-xl'>{data.label}</span>
    </div>;
}