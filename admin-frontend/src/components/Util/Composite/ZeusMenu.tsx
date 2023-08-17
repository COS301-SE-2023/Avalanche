import Dropdown from "../Dropdown";
import { useState } from "react";
import SubmitButton from "../SubmitButton";


export default function Zeusmenu(){
    const [dataSource, setDataSource] = useState<string>("");
    const [endpoint, setEndpoint] = useState<string>("");
    const [typeOfUser, setTypeOfUser] = useState<string>("");
    const [rows, setRows] = useState<string[]>(["hi","bye","thank mikey"]);
    

    const makeRow=()=>{
        return rows.map((item:string,index:number)=><tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {item}
        </th>
        <td className="px-6 py-4">
            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
        </td>
    </tr>)
    }
    return (<>
    <div>
        <div>
            <div className="p-2">
                <Dropdown id='chooseSource' items={["ZACR","AFRICA","RYCE"]} option={dataSource} set={setDataSource} text="Select a Data Source" />
            </div>
            <div className="p-2">
                <Dropdown id='chooseEndpoint' items={["Transactions","Transaction-ranking"]} option={endpoint} set={setEndpoint} text="Select an Endpoint" />
            </div>
            <div className="p-2">
                <Dropdown id='chooseTypeOfUser' items={["Public","Rar","Ry"]} option={typeOfUser} set={setTypeOfUser} text="Select a Type of User" />
            </div>
            <div className="p-2 ">
                <SubmitButton className=" w-full" text={"Fetch"}></SubmitButton>
            </div>
        </div>
        <div className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-700 dark:border-gray-700 flex flex-col gap-2">
            
<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div className="pb-4 w-full">
        <label htmlFor="table-search" className="sr-only">Search</label>
        <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-thirdBackground rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-thirdBackground dark:border-thirdBackground dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items"/>
        </div>
    </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                <tr>
                    
                    <th scope="col" className="px-6 py-3 rounded-tl-lg">
                        Product name
                    </th>
                    <th scope="col" className="px-6 py-3 rounded-tr-lg">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                {makeRow()}
            </tbody>
        </table>
    </div>
</div>

    </div>
    
    </>)
}