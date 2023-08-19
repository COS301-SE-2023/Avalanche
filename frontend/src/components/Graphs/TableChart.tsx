import React from "react";

export function TableChart({ data }: any) {
  data = data.jsonData;
  const headers = data.length ? Object.keys(data[0]) : [];

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded border-lightHover">
        {" "}
        <div className="h-96 overflow-y-auto">
          <table className="w-full h-92 overflow-y-auto border text-sm text-left text-black dark:text-gray-500 dark:text-gray-400 border-gray-400">
            <thead className="text-xs text-black uppercase bg-gray-300 dark:bg-thirdBackground dark:text-gray-400">
              {" "}
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
            </thead>
            <tbody>
              {data.map((row: any, rowIndex: any) => (
                <tr
                  key={rowIndex}
                  className=" border dark:bg-secondaryBackground dark:border-gray-600"
                >
                  {" "}
                  {/* Change here */}
                  {headers.map((header, colIndex) => {
                    const isNumber = /^-?\d+(\.\d+)?$/.test(row[header]); // Check if it's a number
                    return  (
                    <td
                      key={colIndex}
                      className="px-6 py-4 dark:text-lightHover border-l border-r border-gray-400 ${typeof row[header] === 'number' ? 'font-bold' : ''} ${isNumber ? 'font-bold' : ''}"
                    >
                      {" "}
                      {/* Change here */}
                      {row[header]}
                    </td>
                  )})}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
