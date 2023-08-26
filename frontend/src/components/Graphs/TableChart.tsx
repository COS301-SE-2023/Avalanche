import React, { useState } from "react";
import {FunnelIcon} from "@heroicons/react/24/solid";

export function TableChart({ data }: any) {
  data = data.jsonData;
  const headers = data.length ? Object.keys(data[0]) : [];

  // State to hold the selected filters
  const [filters, setFilters] = useState<any>({});

  // Function to handle filter change
  const handleFilterChange = (colIndex: number, value: string) => {
    setFilters({ ...filters, [colIndex]: value });
  };

  // Filter the data based on the selected filters
  const filteredData = data.filter((row: any) =>
    Object.entries(filters).every(
      ([colIndex, value]) =>
        value === "" || row[headers[Number(colIndex)]] === value
    )
  );

  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded border-lightHover">
        <div className="h-96 overflow-y-auto">
          <table className="w-full h-92 overflow-y-auto border text-sm text-left text-black dark:text-gray-500 dark:text-gray-400 border-gray-400">
          <thead className="text-xs text-black uppercase bg-gray-300 dark:bg-thirdBackground dark:text-gray-400">
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx} scope="col" className="px-6 py-3 border border-gray-400">
                    {header}{" "}
                    {idx < headers.length - 1 && (
                      <button onClick={() => setActiveFilter(idx === activeFilter ? null : idx)}>
                        <FunnelIcon  className="w-6 h-6 text-right"/>
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            {activeFilter !== null && (
              <div className="absolute z-10 bg-white border border-gray-400">
                <select onChange={(e) => handleFilterChange(activeFilter, e.target.value)}>
                  <option value="">All</option>
                  {Array.from(new Set(data.map((row: any) => row[headers[activeFilter]]))).map((value, idx) => (
                    <option key={idx} value={String(value)}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <tbody>
              {filteredData.map((row: any, rowIndex: any) => (
                <tr
                  key={rowIndex}
                  className="border dark:bg-secondaryBackground dark:border-gray-600"
                >
                  {headers.map((header, colIndex) => {
                    const isNumber = /^-?\d+(\.\d+)?$/.test(row[header]);
                    return (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 dark:text-lightHover border-l border-r border-gray-400 ${
                          isNumber ? "font-bold" : ""
                        }`}
                      >
                        {row[header]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
