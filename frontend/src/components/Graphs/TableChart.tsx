import React, { useState } from "react";

export function TableChart({ data, qbee }: any) {
  if (!data?.jsonData) {
    return <><div>No data to display</div></>
  }
  data = JSON.parse(JSON.stringify(data.jsonData));
  let headers: string[];
  if (qbee && data?.length > 0) {
    headers = Object.keys(data[0]);

  } else {
    data.splice(0, 1);
    headers = data.length ? Object.keys(data[0]) : [];
  }

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
        value === "" || row[headers[Number(colIndex)]] == value
    )
  );

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded border-lightHover">
        <div className="h-96 overflow-y-auto">
          <table className="w-full h-92 overflow-y-auto border text-sm text-left text-black dark:text-gray-500 dark:text-gray-400 border-gray-400 bg-white">
            <thead className="text-xs text-black uppercase bg-gray-300 dark:bg-thirdBackground dark:text-gray-400">
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className="px-6 py-3 border border-gray-400"
                  >
                    {header}
                  </th>
                ))}
              </tr>

              <tr>
                {headers.map((header, colIndex) => (
                  <th
                    key={colIndex}
                    className="px-6 py-3 border border-gray-400"
                  >
                    {colIndex < headers.length - 1 ? (
                      <select
                        onChange={(e) =>
                          handleFilterChange(colIndex, e.target.value)
                        }
                      >
                        <option value="">All</option>
                        {Array.from(
                          new Set(data.map((row: any) => row[header]))
                        ).map((value, idx) => (
                          <option key={idx} value={String(value)}>
                            {" "}
                            {/* Cast value to string */}
                            {String(value)}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
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
                        className={`px-6 py-4 dark:text-lightHover border-l border-r border-gray-400 ${isNumber ? "font-bold" : ""
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
