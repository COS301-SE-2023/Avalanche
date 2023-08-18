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
import ErrorToast from '../ErrorToast';

interface ITransferFilterData{
    filterData:IFilterData
}

export default function ZeusTab({filterData}: ITransferFilterData) {
    const stateZeus = useSelector(zeusState);
    let [data, setData] = useState<any>({});
    const[prevDataState,setPrevDataStates]=useState<any>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const copy = JSON.parse(JSON.stringify(filterData.filter)) as typeof filterData.filter;
        setData(copy);
        console.log(copy);
        if(prevDataState.length==0){
            setPrevDataStates((existingItems:any[]) => {return [{...copy}]})
        }
    }, []); // Empty dependency array means the effect runs once after initial render


    useEffect(() => {
        console.log("after update",prevDataState);
    }, [prevDataState]); 

    const addItemToEnd = () => {
        setPrevDataStates((existingItems:any[]) => {return [...existingItems,{...data}]})
        console.log(prevDataState);
      }

    function saveFilter() {
        const name=filterData.name;
        dispatch(updateFilterData({name,data}));
        SuccessToast({ text: "Did the save, boss" });
        const copy = JSON.parse(JSON.stringify(data)) as typeof data;
        setData(copy);
    }

    function undo(){
        console.log("before undo",prevDataState)
        if(prevDataState.length>1){
            const prevData={...prevDataState.at(prevDataState.length-2)};
            console.log("prevdata",prevData);
            setPrevDataStates((existingItems:any) => {
                return existingItems.slice(0, existingItems.length - 1)
              })
            setData(prevData);
            console.log("after undo",prevDataState);
        }else{
            ErrorToast({text:"You can't go back any further"});
        }
       
    }


    return <>
        <div className='flex justify-end'>
            <SubmitButton text="Undo" className="mt-4 w-[10%]" onClick={() => undo()} />
        </div>
        <JsonTree readOnly={false} rootName="filter" data={data} onFullyUpdate={addItemToEnd}></JsonTree>
        <div className='flex justify-end'>
            <SubmitButton text="Save" className="mt-4 w-[10%]" onClick={() => saveFilter()} />
        </div>
    </>
}