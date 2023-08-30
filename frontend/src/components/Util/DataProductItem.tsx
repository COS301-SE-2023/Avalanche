import React from 'react'; // Make sure React is imported if you're using JSX.
import { IIntergrationLoginData as IData } from "@/interfaces";

interface IListItemProps {
  name: string;
  endpoint: string;
  image: string;
  setIntegration: React.Dispatch<React.SetStateAction<IData>>;
  setValid: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DataProductItem({
  name, 
  endpoint, 
  image, 
  setIntegration, 
  setValid, 
  setDropdown
}: IListItemProps) {
  return (
    <li>
      <span
        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white flex gap-3 items-center cursor-pointer"
        onClick={() => {
          setIntegration({
            name,
            endpoint,
            image,
          });
          setValid(true);
          setDropdown(false);
        }}
      >
        <img className="h-6" src={image} /> {endpoint}
      </span>
    </li>
  );
}
