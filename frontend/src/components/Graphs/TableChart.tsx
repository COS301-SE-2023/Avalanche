import React from 'react';

export function TableChart({ data }: any ) {
    data= data.jsonData
    const headers = data.length ? Object.keys(data[0]) : [];

    return <>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {headers.map((header, idx) => (
                            <th key={idx} scope="col" className="px-6 py-3">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row: any, rowIndex: any) => (
                        <tr key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            {headers.map((header, colIndex) => (
                                <td key={colIndex} className="px-6 py-4">
                                    {row[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div></>

}