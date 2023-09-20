export enum Role {
    startOfSelect = "selectStart",
    endOfSelect = "selectEnd",
    selectBlock = "selectBlock",
    startOfFilter = "filterStart",
    endOfFilter = "filterEnd",
    orBlock = "orBlock",
    andBlock = "andBlock",
    filterBlock = "filterBlock",
    outputBlock = "outputBlock",
    startOfOutput = "outputStart"
}

export enum Area {
    select = "Select",
    filter = "Filter",
    output = "Output"
}