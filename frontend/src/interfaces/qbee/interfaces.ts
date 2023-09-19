import { Node } from "reactflow"
import { AggregationType, Area, ComparisonOperator, LogicalOperator, Role,  } from "./enums"

// ---- Related to QBee Flow
export interface NodeData {
    connectTo: Role[],
    role: Role,
    area: Area
}

export interface SelectBlock {
    label: string,
    column: string,
    typeOfColumn: string,
    help: string
    aggregationType?: string,
    renamedColumn?: string,
}

export interface OrBlock {
    label: string,
    help: string
}

export interface AndBlock {
    label: string,
    help: string
}

export interface FilterBock {
    label: string,
    column: string,
    typeOfColumn: string,
    aggregationType?: string,
    comparisonTypes: string,
    selectedComparison: string,
    typeOfFilter: string,
    values?: string,
    selectedValues: string[],
    help: string
}

// ---- From the database??
export interface DBData {
    columnName: string,
    columnType: string,
    typeOfFilter: string,
    filterReturnType: string,
    comparisonValues: string[],
    filter: boolean,
    table: string
}

// Request
export interface Query {
    selectedColumns: SelectedColumn[];
    filters: FilterCondition[];
  }
  
export interface SelectedColumn {
    columnName: string;
    aggregation?: AggregationType;
    renamed?: string;
  }
  
export interface FilterCondition {
    type?: LogicalOperator;
    conditions?: FilterCondition[];
    column?: string;
    operator?: ComparisonOperator;
    value?: string | number | boolean;
    aggregation?: AggregationType;
    aggregated?: boolean;
  }
  