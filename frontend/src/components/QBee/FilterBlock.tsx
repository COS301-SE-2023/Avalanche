import { NodeProps, Handle, Position, Connection } from 'reactflow';
import { Role as QBeeRole } from "@/interfaces/qbee/enums";
import { useDispatch, useSelector } from 'react-redux';
import { qbeeState } from '@/store/Slices/qbeeSlice';
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';

interface NodeData {
    label: string,
    column: string,
    typeOfColumn: string,
    aggregationType?: string,
    comparisonTypes: string,
    selectedComparison: string,
    typeOfFilter: string,
    values?: string,
    selectedValues: string[],
    help: string
    connectTo: QBeeRole[],
    quickConnect: any
};

export default function FilterBlock({ data, id }: NodeProps<NodeData>) {

    const stateQBEE = useSelector(qbeeState);
    const dispatch = useDispatch<any>();

    return <div className='bg-avalancheBlue rounded'>
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
            <div className='p-2'>
                <h6 className='text-xl mb-4'>Filter!</h6>
            </div>
            {data.quickConnect && <div className='absolute bg-avalancheBlue rounded-full -right-2 -top-2 flex items-center justify-center p-1 cursor-pointer' onClick={() => data.quickConnect(id, "filterEnd")}>
                <ArrowLongRightIcon className='w-3 h-3' />
            </div>}
        </div>
    </div>
}