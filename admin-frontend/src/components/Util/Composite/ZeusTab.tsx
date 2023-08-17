// @ts-ignore
import {
    JsonTree,
    ADD_DELTA_TYPE,
    REMOVE_DELTA_TYPE,
    UPDATE_DELTA_TYPE,
    DATA_TYPES,
    INPUT_USAGE_TYPES,
} from 'react-editable-json-tree';

import { useEffect, useState } from "react";
import SubmitButton from '../SubmitButton';
import { useDispatch, useSelector } from "react-redux";
import { zeusState ,updateFilters, IFilterData, updateFilterData} from '@/store/Slices/ZeusSlice';
import SuccessToast from '../SuccessToast';

interface ITransferFilterData{
    filterData:IFilterData
}

export default function ZeusTab({filterData}: ITransferFilterData) {
    const stateZeus = useSelector(zeusState);
    let [data, setData] = useState<any>({});
    const dispatch = useDispatch();

    useEffect(() => {
        // Code to run when the component is initialized
        console.log(filterData)
        const copy = JSON.parse(JSON.stringify(filterData.data)) as typeof filterData.data;
        setData(copy);
    }, []); // Empty dependency array means the effect runs once after initial render


    function saveFilter() {
        const name=filterData.name;
        dispatch(updateFilterData({name,data}));
        SuccessToast({ text: "Did the save, boss" });
    }

    return <><JsonTree readOnly={false} rootName="filter" data={data}></JsonTree>
        <div className='flex justify-end'>
            <SubmitButton text="Save" className="mt-4 w-[10%]" onClick={() => saveFilter()} />
        </div>
    </>
}