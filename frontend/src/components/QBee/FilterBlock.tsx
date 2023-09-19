import { NodeProps, Handle, Position, Connection, Node } from 'reactflow';
import { Role as QBeeRole, ComparisonType, Filters as QBFilters } from "@/interfaces/qbee/enums";
import { useDispatch, useSelector } from 'react-redux';
import { qbeeState } from '@/store/Slices/qbeeSlice';
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';
import { BetterDropdown } from '../Util';
import { DBData } from '@/interfaces/qbee/interfaces';
import { CheckboxFilter, DatePickerFilter, NestedCheckbox, RadioboxFilter, ToggleFilter } from '../Graphs/Filters';

interface NodeData {
    label: string,
    column: string,
    typeOfColumn: string,
    aggregationType?: string,
    comparisonType?: ComparisonType,
    selectedComparison: string,
    typeOfFilter: string,
    values?: string,
    selectedValues: string[],
    help: string
    connectTo: QBeeRole[],
    quickConnect: any,
    update: any
};

export default function FilterBlock({ data, id }: NodeProps<NodeData>) {

    const stateQBEE = useSelector(qbeeState);
    const dispatch = useDispatch<any>();

    const getComparisonTypes = (): ComparisonType[] => {
        const node: DBData = stateQBEE.nodes.find((item: Node) => item.id === id);
        if (!node) return [ComparisonType.EQUAL];

        if (!node?.comparisonTypes) return [ComparisonType.EQUAL];

        return node.comparisonTypes;
    }

    const createFilters = () => {

    }

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
                <div className='flex gap-2'>
                    <div>
                        <BetterDropdown
                            items={[]}
                            option={data.column}
                            set={() => { }}
                            text="Select a column"
                        />
                    </div>
                    <div>
                        <BetterDropdown
                            items={getComparisonTypes().map((item: any) => {
                                return { name: item, value: item }
                            })}
                            option={data.comparisonType as string}
                            set={(option: string) => {
                                data.update(id, { comparisonType: option })
                            }}
                            text="Select a Comparison Type"
                        />
                    </div>
                    <div>

                    </div>
                </div>
            </div>
            {data.quickConnect && <div className='absolute bg-avalancheBlue rounded-full -right-2 -top-2 flex items-center justify-center p-1 cursor-pointer' onClick={() => data.quickConnect(id, "filterEnd")}>
                <ArrowLongRightIcon className='w-3 h-3' />
            </div>}
        </div>
    </div>
}