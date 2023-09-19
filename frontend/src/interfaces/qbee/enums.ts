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

export enum AggregationType {
    SUM = "SUM",
    COUNT = "COUNT",
    AVG = "AVG",
    MIN = "MIN",
    MAX = "MAX"
}

export enum Filters {
    DateRange = "DateRange",
    Checkbox = "checkbox",
    Radiobox = "radiobox",
    Togglebox = "togglebox",
    Inputbox = "inputbox",
}

export enum ComparisonOperator {
    EQUAL = "=",
    LIKE = "LIKE",
    GREATERTHAN = ">",
    LESSTHAN = "<"
}

export enum LogicalOperator { 
    and = 'AND',  
    or = 'OR' 
};
