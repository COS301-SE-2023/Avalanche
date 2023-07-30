import { Dropdown } from "@/components/Util";
import { useState } from "react";

export default function NestedCheckbox({ data, request, update }: any) {

    const [selectedZone, setSelectedZone] = useState<string>("");
    const zones = data.values.map((item: any) => item.name);

    const getFiltersForZone = (zone: string) => {
        const meh = data.values.find((item: any) => item.name === zone);
        return meh.filters;
    }


    return (
        <div>

        </div>
    )
}