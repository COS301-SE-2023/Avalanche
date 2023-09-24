import { Node, NodeProps, Handle, Position, Connection } from 'reactflow';
import { Role as QBeeRole } from "@/interfaces/qbee/enums";

interface NodeData {
    role: QBeeRole,
    connectTo: string[],
};

export default function OrBlock({ data }: NodeProps<NodeData>) {
    return <div className='bg-avalancheBlue rounded'>
        {/* Handles */}
        <Handle
            type="source"
            position={Position.Right}
            isValidConnection={(connection: Connection) => {
                if (connection?.target?.split("-")[0]) {
                    if (!data.connectTo.includes(connection?.target?.split("-")[0] as string)) {
                        return false
                    }
                } else {
                    if (!data.connectTo.includes(connection?.target as string)) {
                        return false;
                    };
                }
                return true;
            }}
        />
        <Handle
            type="target"
            position={Position.Left}
            isValidConnection={(connection) => {
                if (!data.connectTo.includes(connection?.target as string)) return false;
                return true;
            }}
        />
        {/* End of Handles */}
        <div className='p-2 flex items-center justify-center pr-4 pl-4'>
            <h6 className='text-xl'>Match Any<br></br>(Or)</h6>
        </div>
    </div>;
}