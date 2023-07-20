import { Handle, Position } from "reactflow";

function ParentNode({ data, isConnectable }: any) {
  const { heading, description } = data;

  //   return (
  //     <div className="flex justify-between h-64 w-full bg-gray-300 rounded-lg  dark:bg-gray-700 p-6">
  //       <Handle
  //         type="source"
  //         position={Position.Bottom}
  //         id="a"
  //         isConnectable={isConnectable}
  //       />
  //       <div>
  //             <h1 className="text-lg text-gray-900 dark:text-white font-bold">{heading}</h1>
  //             <p className="text-base text-gray-400">{description}</p>
  //       </div>
  //       <Handle
  //         type="source"
  //         position={Position.Bottom}
  //         id="b"
  //         isConnectable={isConnectable}
  //       />
  //     </div>
  //   );
  return (
    <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
      <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
        {heading}
      </h5>
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
        {description}
      </p>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default ParentNode;
