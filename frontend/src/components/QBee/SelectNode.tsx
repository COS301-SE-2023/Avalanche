import { AggregationType, Role as QBeeRole } from "@/interfaces/qbee/enums";
import { DBData } from '@/interfaces/qbee/interfaces';
import { qbeeState } from '@/store/Slices/qbeeSlice';
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { Connection, Handle, NodeProps, Position } from 'reactflow';
import { BetterDropdown, Input, InputLabel } from '../Util';

interface NodeData {
    label: string,
    column: string,
    typeOfColumn: string,
    help: string,
    aggregationType: string,
    renamedColumn: string,
    connectTo: QBeeRole[],
    quickConnect?: any,
    update: any
};

export default function SelectBlock({ data, id }: NodeProps<NodeData>) {

    const stateQBEE = useSelector(qbeeState);

    const getType = () => {
        const type = stateQBEE.data.find((item: DBData) => item.columnName === data.column);
        if (!type) return;
        return type.columnType;
    }

    return <div className='bg-avalancheBlue rounded border-2 border-white shadow'>
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
                <h6 className='text-xl mb-4'>Select a Column</h6>
                <div className='mb-2'>
                    <InputLabel htmlFor='column' text="Select a column" className='text-white' />
                    <BetterDropdown
                        id='column'
                        items={stateQBEE.data.map((item: DBData) => {
                            return { name: item.columnName, value: item.columnName };
                        })}
                        option={data.column}
                        placement='below'
                        absolute={true}
                        set={(option: string) => {
                            data.update(id, { column: option });

                            // Getting column type
                            const type = stateQBEE.data.find((item: DBData) => item.columnName === option);
                            if (!type) return;

                            data.update(id, { typeOfColumn: type.columnType });

                        }}
                        text='Select a column'
                    />
                </div>
                {getType() === "number" && <div className='mb-2'>
                    <InputLabel htmlFor='aggregation' text="Select an Aggregation" className='text-white' />
                    <BetterDropdown
                        id='column'
                        items={[
                            { name: AggregationType.SUM, value: AggregationType.SUM },
                            { name: AggregationType.COUNT, value: AggregationType.COUNT },
                            { name: AggregationType.AVG, value: AggregationType.AVG },
                            { name: AggregationType.MIN, value: AggregationType.MIN },
                            { name: AggregationType.MAX, value: AggregationType.MAX }
                        ]}
                        option={data.aggregationType}
                        placement='below'
                        absolute={true}
                        set={(option: string) => {
                            data.update(id, { aggregationType: option });
                        }}
                        text='Select an aggregation type'
                    />
                </div>}
                <div className='mb-2'>
                    <InputLabel htmlFor='name' text="Rename your column" className='text-white' />
                    <Input
                        placeholder={data.column}
                        type="text"
                        name="name"
                        required={false}
                        id={`name-${id}`}
                        value={data.renamedColumn}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => data.update(id, { renamedColumn: event.currentTarget.value })}
                    />
                </div>
            </div>
        </div>
        {data.quickConnect && <div className='absolute bg-avalancheBlue rounded-full -right-2 -top-2 flex items-center justify-center p-1 cursor-pointer' onClick={() => data.quickConnect(id, "selectEnd")}>
            <ArrowLongRightIcon className='w-3 h-3' />
        </div>}
    </div>
}