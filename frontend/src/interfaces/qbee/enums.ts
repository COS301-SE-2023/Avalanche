export enum Role {
    startOfSelect = "selectStart",
    endOfSelect = "selectEnd",
    selectBlock = "selectBlock",
    startOfFilter = "filterStart",
    endOfFilter = "filterEnd",
    orBlock = "orBlock",
    andBlock = "andBlock",
    filterBlock = "filterBlock"
}

export enum Area {
    select = "Select",
    filter = "Filter",
    output = "Output"
}