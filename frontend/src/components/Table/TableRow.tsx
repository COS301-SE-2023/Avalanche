import { useState } from "react"

interface ITableSort {

}

interface ITableRow {
    children: React.ReactNode,
    sortable: boolean,
    sort: ITableSort
}

export default function TableRow({ children }: ITableRow) {
    return (
        <></>
    )
}