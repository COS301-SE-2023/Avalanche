import { NodeProps, Handle, Position, Connection, Node } from 'reactflow';
import { Role as QBeeRole, ComparisonType, Filters as QBFilters } from "@/interfaces/qbee/enums";
import { useDispatch, useSelector } from 'react-redux';
import { qbeeState } from '@/store/Slices/qbeeSlice';
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';
import { BetterDropdown } from '../Util';
import { DBData } from '@/interfaces/qbee/interfaces';
import { CheckboxFilter, DatePickerFilter, NestedCheckbox, RadioboxFilter, ToggleFilter, InputBox } from '../Graphs/Filters';
import { generateDefaultValue, camelCaseRenderer } from '../Graphs/Filters/util';

interface NodeData {
    label: string,
    column: string,
    typeOfColumn: string,
    comparisonType?: ComparisonType,
    selectedComparison: string,
    typeOfFilter: string,
    values?: string,
    selectedValues: string[],
    help: string
    connectTo: QBeeRole[],
    quickConnect: any,
    update: any,
};

export default function FilterBlock({ data, id }: NodeProps<NodeData>) {

    const stateQBEE = useSelector(qbeeState);
    const dispatch = useDispatch<any>();

    const getComparisonTypes = (): ComparisonType[] => {
        const node: any = stateQBEE.data.find((item: DBData) => item.columnName === data.column);
        if (!node) return [ComparisonType.EQUAL];
        if (!node?.comparisonTypes) return [ComparisonType.EQUAL];
        return node.comparisonTypes;
    }

    const getColumns = () => {
        return stateQBEE.data.filter((item:DBData) => {
            if (item.filter == true)
                return item;
        });
    }

    const getNodeFromData = () => {
        return stateQBEE.data.find((item: DBData) => item.columnName === data.column);
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
                <h6 className='text-xl mb-2'>Filter</h6>
                <div className='flex gap-2'>
                    {getColumns().length === 0 ? <p>🛑 You have no columns added to the select field. Please add one to continue.</p> : <>
                        <div>
                            <BetterDropdown
                                items={getColumns().map((item: DBData) => {
                                    return { name: item.columnName, value: item.columnName };
                                })}
                                option={data.column}
                                set={(option: any) => {
                                    data.update(id, { column: option });
                                    data.update(id, { selectedValues: generateDefaultValue(getNodeFromData()?.typeOfFilter), typeOfColumn: getNodeFromData()?.columnType, typeOfFilter: getNodeFromData()?.typeOfFilter })
                                }}
                                text="Select a column"
                                absolute={true}
                            />
                        </div>
                        {data.column && <div>
                            <BetterDropdown
                                items={getComparisonTypes().map((item: any) => {
                                    return { name: item, value: item }
                                })}
                                option={data.comparisonType as string}
                                set={(option: any) => {
                                    data.update(id, { comparisonType: option, operator: option });
                                }}
                                text="Select a Comparison Type"
                                absolute={true}
                            />
                        </div>}
                        {data.column && data.comparisonType && <div>
                            {getNodeFromData().typeOfFilter === "checkbox" && (
                                <CheckboxFilter
                                    data={{ values: getNodeFromData().filterValues }}
                                    request={{ value: data.selectedValues }} //same as value, wtf Michael
                                    update={(name: string, option: any) => data.update(id, { selectedValues: option })}
                                />
                            )}
                            {getNodeFromData().typeOfFilter === "date-picker" && (
                                <DatePickerFilter
                                    data={{ values: getNodeFromData().columnName }}
                                    request={null}
                                    update={(name: string, option: any) => data.update(id, { selectedValues: option })}
                                />
                            )}
                            {getNodeFromData().typeOfFilter === "radiobox" && (
                                <RadioboxFilter
                                    data={{ name: getNodeFromData().columnName }}
                                    request={{ value: data.selectedValues }}
                                    update={(name: string, option: any) => data.update(id, { selectedValues: option })}
                                    camelCase={camelCaseRenderer}
                                />
                            )}
                            {getNodeFromData().typeOfFilter === "togglebox" && (
                                <ToggleFilter
                                    data={{ name: getNodeFromData().columnName }}
                                    request={{ value: data.selectedValues }}
                                    update={(name: string, option: any) => data.update(id, { selectedValues: option })}
                                />
                            )}
                            {/*{getNodeFromData().typeOfFilter === "nestedCheckbox" && (
                            <NestedCheckbox
                                data={element}
                                request={request["transactions"]}
                                update={updateRequestObject}
                            />
                        )} */}
                            {getNodeFromData().typeOfFilter === "inputbox" && (
                                <InputBox
                                    data={{ name: getNodeFromData().columnName }}
                                    request={{ value: "", data: data.selectedValues }}
                                    update={(name: string, option: any) => data.update(id, { selectedValues: option })}
                                />
                            )}
                        </div>}
                    </>}

                </div>
            </div>
            {data.quickConnect && <div className='absolute bg-avalancheBlue rounded-full -right-2 -top-2 flex items-center justify-center p-1 cursor-pointer' onClick={() => data.quickConnect(id, "filterEnd")}>
                <ArrowLongRightIcon className='w-3 h-3' />
            </div>}
        </div>
    </div>
}