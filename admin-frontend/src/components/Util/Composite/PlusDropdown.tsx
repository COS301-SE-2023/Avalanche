import Dropdown from "../Dropdown";
import { zeusState, IZeusState, updateFilters, IFilterData, updateDataSource, updateEndpoint, updateTypeOfUser, getFilters, updateNeedToFetch } from "@/store/Slices/ZeusSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectModalManagerState, setCurrentOpenState } from '@/store/Slices/modalManagerSlice';

interface IPlusDropdown {
    items: string[],
    option: string,
    set: any,
    id?: string,
    text?: string
    action?: string
}

export default function PlusDropdown({ items, option, set, id, text,action }: IPlusDropdown) {
    
    const stateZeus = useSelector(zeusState);
    
    const dispatch = useDispatch<any>();

    return <>
    <div className="p-2 flex">
                    <div className="flex-grow">
                    <Dropdown id={id} items={items} option={option} set={set} text={text} />
                    </div>
                    <div>
                    <button onClick={() => {
                                    dispatch(setCurrentOpenState(action));
                                }}
                                type="button" className="rounded-lg text-white hover:bg-blue-800 focus:ring-3 focus:outline-none focus:ring-blue-300 font-medium text-sm p-1.5 text-center dark:hover:bg-thirdBackground dark:focus:blue-800">
                        <svg className="w-5 h-5 m-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10">
                            <path stroke="#22C55E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M 0 5 L 10 5 M 5 0 L 5 10" />
                        </svg>
                    </button>
                    </div>
                </div>
                
    </>
    
}