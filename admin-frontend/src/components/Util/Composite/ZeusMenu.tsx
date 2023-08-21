import Dropdown from "../Dropdown";
import { useState, useEffect } from "react";
import SubmitButton from "../SubmitButton";
import { useDispatch, useSelector } from "react-redux";
import { zeusState, IZeusState, updateFilters, IFilterData, updateDataSource, updateEndpoint, updateTypeOfUser, getFilters, updateNeedToFetch } from "@/store/Slices/ZeusSlice";
import { IFetchFiltersRequest } from "@/interfaces/requests/FetchFilterRequest";
import SuccessToast from "../SuccessToast";


export default function ZeusMenu() {
    const dispatch = useDispatch<any>();
    const stateZeus = useSelector(zeusState);
    const ITEMS_PER_PAGE: number = 5;
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        if (search !== "") {

        }
    }, [search]);

    const incrementPage = () => {
        if (page < Math.floor(((stateZeus.zeus.filters.length) / ITEMS_PER_PAGE) + 1)) {
            setPage(page + 1)
        }

    }

    const decrementPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    const openTab = (name: string) => {

        let newArr: IFilterData[] = [];
        stateZeus.zeus.filters.filter((e: IFilterData) => {
            let copied = { ...e };
            if (copied.name == name) {
                copied.opened = true;
                copied.selected = true;
            }
            else {
                copied.selected = false;
            }
            newArr.push(copied);
        })

        dispatch(updateFilters(newArr));
    }


    const removeFilter = (name: string) => {
        let newArr: IFilterData[] = [];
        stateZeus.zeus.filters.filter((e: IFilterData) => {
            let copied = { ...e };
            if (copied.name !== name) { newArr.push(copied); }

        })
        dispatch(updateFilters(newArr));
    }
    const duplicateFilter = (name: string) => {
        let newArr: IFilterData[] = [];
        stateZeus.zeus.filters.filter((e: IFilterData) => {
            let copied = { ...e };
            newArr.push(copied);
            if (copied.name == name) {
                let duplicated = JSON.parse(JSON.stringify(copied)) as typeof copied;
                duplicated.name += "_copy";
                duplicated.filter.id = -1;
                duplicated.filter.name += "_copy";
                copied.selected = false;
                newArr.push(duplicated)
            }

        })
        dispatch(updateFilters(newArr));
    }

    const reduceDataSource = (dataSource: string) => {
        dispatch(updateDataSource(dataSource));
    }

    const reduceEndpoint = (endpoint: string) => {
        dispatch(updateEndpoint(endpoint));
    }

    const reduceTypeOfUser = (typeOfUser: string) => {
        dispatch(updateTypeOfUser(typeOfUser));
    }

    const fetchFilters = () => {
        dispatch(getFilters(
            {
                dataSource: stateZeus.zeus.fetchParams.dataSource,
                endpoint: stateZeus.zeus.fetchParams.endpoint,
                typeOfUser: stateZeus.zeus.fetchParams.typeOfUser
            } as IFetchFiltersRequest))

    }

    useEffect(() => {
       
        if(stateZeus.zeus.needToFetch){
            setTimeout(() => {  fetchFilters();
                dispatch(updateNeedToFetch(false))
                SuccessToast({text:"Reloaded"}); }, 5000);
            
        } 
        
        }, [stateZeus.zeus.needToFetch])

    const makeRow = (searchString: string) => {
        const zeus: IZeusState = stateZeus.zeus;
        const rowsWithSearch: IFilterData[] = zeus.filters.filter((el: IFilterData) => { return el.name.toLowerCase().includes(searchString.toLowerCase()) })
        const showRows: IFilterData[] = rowsWithSearch.slice((page - 1) * ITEMS_PER_PAGE, (page * ITEMS_PER_PAGE));
        showRows.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        return showRows.map((item: IFilterData, index: number) => <tr key={index} className="bg-white border-b dark:bg-secondaryBackground dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-thirdBackground">

            <th scope="row" className="overflow-auto px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {item.name}
            </th>
            <td className="px-6 py-4">
                <a onClick={() => { openTab(item.name.replaceAll(" ", "-")) }} className="p-1 font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                <a onClick={() => { duplicateFilter(item.name.replaceAll(" ", "-")) }} className="p-1 font-medium text-blue-600 dark:text-green-500 hover:underline">Duplicate</a>
                <a onClick={() => { removeFilter(item.name.replaceAll(" ", "-")) }} className="p-1 font-medium text-red-600 dark:text-red-500 hover:underline">Remove</a>
            </td>
        </tr>)
    }
    return (<>
        <div>
            <div>
                <div className="p-2">
                    <Dropdown id='chooseSource' items={["zacr", "africa", "ryce"]} option={stateZeus.zeus.fetchParams.dataSource} set={reduceDataSource} text="Select a Data Source" />
                </div>
                <div className="p-2">
                    <Dropdown id='chooseEndpoint' items={["transactions", "transactions-ranking", "marketShare", "age", "domainNameAnalysis/count", "domainNameAnalysis/length", "movement/vertical"]} option={stateZeus.zeus.fetchParams.endpoint} set={reduceEndpoint} text="Select an Endpoint" />
                </div>
                <div className="p-2">
                    <Dropdown id='chooseTypeOfUser' items={["public", "registrar", "registry"]} option={stateZeus.zeus.fetchParams.typeOfUser} set={reduceTypeOfUser} text="Select a Type of User" />
                </div>
                <div className="p-2 ">
                    <SubmitButton onClick={fetchFilters} className=" w-full" text={"Fetch"}></SubmitButton>
                </div>
            </div>
            <div className="pt-4 mt-2 space-y-2 font-medium border-t border-gray-700 dark:border-gray-700 flex flex-col gap-2">

                <div className="relative overflow-x-auto rounded sm:rounded-lg">
                    <div className="pb-4 w-full">
                        <label htmlFor="table-search" className="sr-only">Search</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input onChange={event => {setSearch(event.target.value);}} type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-thirdBackground rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-thirdBackground dark:border-thirdBackground dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
                        </div>
                    </div>
                    <table className="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400 h-40">
                        <thead className="text-xs text-gray-700 uppercase  dark:bg-thirdBackground dark:text-gray-400 ">
                            <tr>

                                <th scope="col" className=" w-[190px] px-6 py-3 rounded-tl-lg">
                                    Filter Name
                                </th>
                                <th scope="col" className="px-6 py-3 rounded-tr-lg">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {makeRow(search)}
                        </tbody>
                    </table>
                    <div className="flex flex-col items-center pt-4 grow h-full">

                        <span className="text-sm text-gray-700 dark:text-gray-400">
                            Showing <span className="font-semibold text-gray-900 dark:text-white">{((page - 1) * ITEMS_PER_PAGE + 1)}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(((page) * ITEMS_PER_PAGE), stateZeus.zeus.filters.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{stateZeus.zeus.filters.length}</span> Entries
                        </span>
                        <div className="inline-flex mt-2 xs:mt-0 ">
                            <button onClick={decrementPage} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-thirdBackground dark:border-gray-700 dark:text-gray-400 dark:hover:bg-avalancheBlue dark:hover:text-white">
                                <svg className="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                                </svg>
                                Prev
                            </button>
                            <button onClick={incrementPage} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-thirdBackground dark:border-gray-700 dark:text-gray-400 dark:hover:bg-avalancheBlue dark:hover:text-white">
                                Next
                                <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </>)
}