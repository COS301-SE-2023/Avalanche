# Interfaces
```
enum Role {
    startOfSelect,
    endOfSelect,
    selectBlock,
    startOfFilter,
    endOfFilter,
    orBlock,
    andBlock,
    filterBlock
}
```

```
enum Area {
    select = "Select",
    filter = "Filter",
    output = "Output"
}
```

```
interface Node {
    connectTo: Role[], 
        //can have function or something based on role instead of storing in each node - might make it slower but idk
    role: Role
    area: Area
}
```

```
interface Edge {

}
```

## Per role connectTo:
* startOfSelect:
  * selectBlock
* selectBlock:
  * selectBlock
  * endOfSelect
* endOfSelect:
  * n/a
* startOfFilter:
  * orBlock
  * filterBlock
  * endOfFilter
* orBlock:
  * filterBlock
  * orBlock
* andBlock:
  * orBlock
  * filterBlock
* filterBlock:
  * andBlock
  * orBlock
  * endOfFilter
* endOfFilter:
  * n/a

## Per role Data
* startOfSelect:
```
//possibly:
{ label: 'Start Of Select' }
//But since we may just make it a block on side then nothing
```
* selectBlock:
```
{
    label: string,
    column: string,
    typeOfColumn: string, // eg number, date or text
    aggregationType?: string,
    renamedColumn?: string, // user input
    help: string // info about what it does
 }
 //aggregationType and TypeOfColumn should probably be enums
```
* endOfSelect:
```
//possibly:
{ label: 'End Of Select' }
//But since we may just make it a block on side then nothing
```
* startOfFilter:
```
//possibly:
{ label: 'Start Of Filters' }
//But since we may just make it a block on side then nothing
```
* orBlock:
```
{
    label: string,
    help: string // info about what it does
 }
```
* andBlock:
```
{
    label: string,
    help: string // info about what it does
 }
```
* filterBlock:
```
{
    label: string,
    column: string,
    typeOfColumn: string, // eg number, date or text
    aggregationType?: string, // only on number type probably 
    comparisonTypes: string,
    selectedComparison: string,
    typeOfFilter: string, //eg. checkbox, daterange etc.
    filterValues?: string, //eg. for checkboxes
    selectedValues: string[] | number | string | any
    help: string // info about what it does
 }
 //aggregationType and TypeOfColumn should probably be enums
```
* endOfFilter:
```
//possibly:
{ label: 'Start Of Filters' }
//But since we may just make it a block on side then nothing
```

## Input Schema:
```
Column[]
```
Column:
```
Interface Column {
    columnName: string,
    columnType: string, //or enum
    typeOfFilter: string, // or enum
    filterReturnType: string, 
    filterValues?: string[],
    filter: boolean,
    table: string // which table it's from or some mapping (for grouping)
},
```