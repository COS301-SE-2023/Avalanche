import { Node, NodeProps, Handle, Position, Connection } from 'reactflow';
import { SelectBlock } from '@/interfaces/qbee/interfaces';
import { Role as QBeeRole } from "@/interfaces/qbee/enums";
import { useSelector } from 'react-redux';
import { qbeeState } from '@/store/Slices/qbeeSlice';

interface NodeData {
    label: string,
    column: string,
    typeOfColumn: string,
    help: string,
    aggregationType: string,
    renamedColumn: string,
    connectTo: QBeeRole[]
};

export default function SelectBlock({ data }: NodeProps<NodeData>) {

    const stateQBEE = useSelector(qbeeState);

    return <div className='bg-avalancheBlue p-3 rounded'>
        <div>
            <Handle
                type="target"
                position={Position.Left}
            />
            <Handle
                type="source"
                position={Position.Right}
                isValidConnection={(connection: Connection) => {

                    if (connection.target === connection.source) return false;

                    if (connection?.target?.split("-")[0]) {
                        if (!data.connectTo.includes(connection?.target?.split("-")[0] as QBeeRole)) {
                            return false
                        }
                    } else {
                        if (!data.connectTo.includes(connection?.target as QBeeRole)) {
                            return false;
                        };
                    }

                    return true;
                }}
            />
            <span className='text-xl'>Select</span>
        </div>
    </div>
}