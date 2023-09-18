import { Node } from "reactflow"
import { Area, Role } from "./enums"

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