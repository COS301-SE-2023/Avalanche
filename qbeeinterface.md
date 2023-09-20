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
    connectTo: Role[], //can have function or something based on role instead of storing in each node - might make it slower but idk
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
    values?: string, //eg. for checkboxes
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
type ColumnType = 'string' | 'number' | 'date' | 'boolean';
type FilterType = 'checkbox' | 'input' | 'date-picker';
type FilterReturnType = 'string' | 'string[]' | 'number' | 'date' | 'boolean';

interface Column {
    columnName: string;
    columnType: ColumnType;
    typeOfFilter: FilterType;
    filterReturnType: FilterReturnType;
    filterValues?: string[];
    filter: boolean;
    table: string;
}

```
### Example:
```
const schema: Column[] = [
    {
        columnName: 'Title',
        columnType: 'string',
        typeOfFilter: 'inputbox',
        filterReturnType: 'string',
        filter: true,
        table: 'Books'
    },
    {
        columnName: 'PublicationDate',
        columnType: 'date',
        typeOfFilter: 'date-picker',
        filterReturnType: 'date',
        filter: true,
        table: 'Books'
    },
    {
        columnName: 'Genre',
        columnType: 'string',
        typeOfFilter: 'checkbox',
        filterReturnType: 'string[]',
        filterValues: ['Fantasy', 'SciFi', 'Romance', 'Mystery'],
        filter: true,
        table: 'Books'
    },
    {
        columnName: 'AuthorID',
        columnType: 'number',
        typeOfFilter: 'inputbox',
        filterReturnType: 'number',
        filter: false,
        table: 'Books'
    },
    {
        columnName: 'AuthorName',
        columnType: 'string',
        typeOfFilter: 'inputbox',
        filterReturnType: 'string',
        filter: true,
        table: 'Authors'
    },
    {
        columnName: 'Nationality',
        columnType: 'string',
        typeOfFilter: 'checkbox',
        filterReturnType: 'string[]',
        filterValues: ['American', 'British', 'French', 'German'],
        filter: true,
        table: 'Authors'
    }
];
```
## Traversed schema:
```
interface Query {
  selectedColumns: SelectedColumn[];
  filters: FilterCondition[];
}

interface SelectedColumn {
  columnName: string;
  aggregation?: AggregationType;
  renamed?: string;
}

type AggregationType = 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX'; // Add more aggregation types as needed

interface FilterCondition {
  type?: LogicalOperator;
  conditions?: FilterCondition[];
  column?: string;
  operator?: ComparisonOperator;
  value?: string | number | boolean;
  aggregation?: AggregationType;
  aggregated?: boolean;
}

type LogicalOperator = 'AND' | 'OR';
type ComparisonOperator = '=' | '<' | '>' | '<=' | '>=' | 'LIKE'; // Add more comparison operators as needed

```

### Example
JSON as payload to backend:
```
{
  "selectedColumns": [
    {
      "columnName": "Genre",
      "renamed": "Book Genre"
    },
    {
      "columnName": "YearPublished",
      "aggregation": "AVG",
      "renamed": "Average Publication Year"
    },
    {
      "columnName": "BookTitle",
      "aggregation": "COUNT",
      "renamed": "Total Books"
    },
    {
      "columnName": "Author"
    }
  ],
  "filters": [
    {
      "type": "OR",
      "conditions": [
        {
          "type": "AND",
          "conditions": [
            {
              "type": "OR",
              "conditions": [
                {
                  "column": "Genre",
                  "operator": "=",
                  "value": "Fantasy"
                },
                {
                  "column": "Genre",
                  "operator": "=",
                  "value": "SciFi"
                }
              ]
            },
            {
              "column": "YearPublished",
              "operator": "<",
              "value": 2015
            }
          ]
        },
        {
          "column": "Author",
          "operator": "=",
          "value": "John Green"
        },
        {
          "column": "BookTitle",
          "aggregation": "COUNT",
          "operator": ">",
          "value": 5,
          "aggregated": true
        }
      ]
    }
  ]
}

```
Translated to:
```
SELECT 
    Genre AS "Book Genre",
    AVG(YearPublished) AS "Average Publication Year",
    COUNT(BookTitle) AS "Total Books",
    Author
FROM TableName
WHERE 
    (
        (Genre = 'Fantasy' OR Genre = 'SciFi') 
        AND YearPublished < 2015
    ) 
    OR Author = 'John Green'
GROUP BY Genre, Author
HAVING COUNT(BookTitle) > 5;
```

### Another example
```
{
  "selectedColumns": [
    { "columnName": "Title", "renamed": "Book Title" },
    { "columnName": "PublicationDate", "renamed": "Release Date" },
    { "columnName": "Genre" },
    { "columnName": "AuthorName", "renamed": "Author" }
  ],
  "filters": [
    {
      "type": "AND",
      "conditions": [
        { "column": "Genre", "operator": "=", "value": "Fantasy" },
        { "column": "Nationality", "operator": "=", "value": "British" }
      ]
    }
  ]
}

=====================================
SELECT 
    b.Title AS "Book Title",
    b.PublicationDate AS "Release Date",
    b.Genre,
    a.AuthorName AS "Author"
FROM 
    Books b
JOIN 
    Authors a ON b.AuthorID = a.AuthorID
WHERE 
    b.Genre = 'Fantasy' AND a.Nationality = 'British';

====================================
The JOIN clause is inferred from the fact that both Books and Authors tables are involved in the query and there's a common AuthorID column in both tables.
The table aliases b and a are used for brevity and clarity in the SQL statement.
```
## Output --> for table
```
[{
  col1: data,
  col2: data1
},
{
  col1: data2,
  col2: data3
}]
```