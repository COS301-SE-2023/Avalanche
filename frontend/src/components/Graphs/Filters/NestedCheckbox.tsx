import { Dropdown } from "@/components/Util";
import { useState } from "react";
import { CheckboxFilter } from "./";

export default function NestedCheckbox({ data, request, update }: any) {

    const [selectedZone, setSelectedZone] = useState<string>("");
    const zones = data.values.map((item: any) => item.name);

    const getFiltersForZone = (zone: string) => {
        const meh = data.values.find((item: any) => item.name === zone);
        return meh.filters[0];
    }

    return (
        <div>
            <Dropdown items={zones} option={selectedZone} set={(value: any) => setSelectedZone(value)} />
            {selectedZone && <CheckboxFilter request={request} update={update} data={getFiltersForZone(selectedZone)} />}
        </div>
    )
}