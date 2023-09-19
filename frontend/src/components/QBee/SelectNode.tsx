import { NodeProps, Handle, Position, Connection } from 'reactflow';
import { SelectBlock } from '@/interfaces/qbee/interfaces';
import { Role as QBeeRole } from "@/interfaces/qbee/enums";
import { useDispatch, useSelector } from 'react-redux';
import { qbeeState, selectTable } from '@/store/Slices/qbeeSlice';
import { BetterDropdown, InputLabel } from '../Util';
import { useState } from 'react';
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';

interface NodeData {
    label: string,
    column: string,
    typeOfColumn: string,
    help: string,
    aggregationType: string,
    renamedColumn: string,
    connectTo: QBeeRole[],
    quickConnect?: any
};

export default function SelectBlock({ data, id }: NodeProps<NodeData>) {

    const stateQBEE = useSelector(qbeeState);
    const dispatch = useDispatch<any>();
    const [selectedTable, setSelectedTable] = useState<string>("");
    const [selectedColumn, setSelectedColumn] = useState<string>("");

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
                <h6 className='text-xl mb-4'>{selectedTable ? selectedColumn ? `${selectedTable} | ${selectedColumn}` : `${selectedTable}` : "Select a Table"}</h6>
                <div className='mb-2'>
                    <InputLabel htmlFor='table' text="Select a table" className='text-white' />
                    <BetterDropdown
                        id="table"
                        items={stateQBEE.tables.map((item: string) => {
                            return { name: item, value: item };
                        })}
                        option={selectedTable}
                        set={(option: string) => {
                            setSelectedTable(option);
                            setSelectedColumn("");
                            dispatch(selectTable(option));
                        }}
                        placement='below'
                        absolute={true}
                        text='Select a table'
                    />
                </div>
                {selectedTable && <div className='mb-2'>
                    <InputLabel htmlFor='column' text="Select a column" className='text-white' />
                    <BetterDropdown
                        id='column'
                        items={stateQBEE.columns.map((item: string) => {
                            return { name: item, value: item };
                        })}
                        option={selectedColumn}
                        placement='below'
                        absolute={true}
                        set={(option: string) => {
                            setSelectedColumn(option);
                        }}
                        text='Select a column'
                    />
                </div>}
            </div>
        </div>
        {data.quickConnect && <div className='absolute bg-avalancheBlue rounded-full -right-2 -top-2 flex items-center justify-center p-1 cursor-pointer' onClick={() => data.quickConnect(id, "selectEnd")}>
            <ArrowLongRightIcon className='w-3 h-3' />
        </div>}
    </div>
}