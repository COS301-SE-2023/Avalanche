import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { CheckboxFilter, DatePickerFilter, RadioboxFilter, ToggleFilter, NestedCheckbox } from ".";

export const camelCaseRenderer = (value: string) => {
    return value.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
}

export const generateDefaultValue = (type: string) => {
    switch (type) {
        case "togglebox": {
            return false;
        }
        case "string": {
            return "";
        }
        case "checkbox": {
            return [];
        }
        case "radiobox": {
            return "";
        }
        case "nestedCheckbox": {
            return [];
        }
    }
}

export const filterGraphs = (warehouse: string, state: any, gType: string) => {
    if (warehouse) {
        const ep = state.filters.find((item: any) => item.endpoint === warehouse);
        if (!ep) return [];
        return ep.graphs.find((item: any) => item.name === gType);
    }
    return [];
}

export const renderFilters = (filterGraphs: any, addRequestObject: any, request: any, updateRequestObject: any) => {
    return filterGraphs()?.filters?.map((element: any, index: number) => {
        return <Disclosure key={index}>
            {({ open, close }) => (
                <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75" onClick={() => {
                        addRequestObject(element.name, element);
                    }}>
                        <div className="flex gap-4 items-center">
                            {camelCaseRenderer(element.name)}
                        </div>
                        <ChevronDownIcon className={`w-6 h-6 ${open && "rotate-180"}`} />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        {element.input === "checkbox" && <CheckboxFilter data={element} request={request[element.name]} update={updateRequestObject} />}
                        {element.input === "date-picker" && <DatePickerFilter data={element} request={request[element.name]} update={updateRequestObject} />}
                        {element.input === "radiobox" && <RadioboxFilter data={element} request={request[element.name]} update={updateRequestObject} camelCase={camelCaseRenderer} />}
                        {element.input === "togglebox" && <ToggleFilter data={element} request={request[element.name]} update={updateRequestObject} />}
                        {element.input === "nestedCheckbox" && <NestedCheckbox data={element} request={request[element.name]} update={updateRequestObject} />}
                    </Disclosure.Panel>
                    <hr />
                </>
            )}
        </Disclosure>
    })
}