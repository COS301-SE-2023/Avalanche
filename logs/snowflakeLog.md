# Snowflake Warehouse Log
> All changes to the Snowflake Datawarehouse will be logged here

This has been left intentionally vague in order to protect the schema.
For more information request formal documentation from ...

## Views
### Dimensions
| View   | Description |
| --   | -- |
| Dim Date | Dimension containing information about the date including day of month, day of week, day in quarter and other important information |
| Dim Registry| Dimension containing information about registry |
| Dim Registry Domain| Dimension containing information about a domain |
| Dim Registry Product| Dimension containing information about registry products  |
| Dim Registry Registrar | Dimension containing information about registrar in registry  |
## Procedures
| Procedure  | Description | Input | Output |
| --   | -- | --   | -- |
| Registrar Transactions| This procedure returns the aggregated transactions for a specific registrar, all registrars grouped by registrar or all overall | JSON object string containing the registrar, zone, dateFom, dateTo and granularity   | JSON in graphDataInterface format|
| Creates  | This procedure returns the aggregated create transactions for a specific registrar, all registrars grouped by registrar or all overall | JSON object string containing the registrar, zone, dateFom, dateTo and granularity   | JSON in graphDataInterface format|
|Renewals  | This procedure returns the renewals for a specific registrar, all registrars grouped by registrar or all overall | JSON object string containing the registrar, zone, dateFom, dateTo and granularity   | JSON in graphDataInterface format|
| Deletion  | This procedure returns the deletions for a specific registrar, all registrars grouped by registrar or all overall | JSON object string containing the registrar, zone, dateFom, dateTo and granularity   | JSON in graphDataInterface format|
| Marketshare | This procedure returns market share of registrars  in the registry | JSON object string containing the registrars, zone and rank    | JSON of  registrar and count|
| Age Analysis | This procedure returns the number of  domains per age, overall or per regisrar| JSON object string containing the registrars, zone and rank    | JSON of  registrar, age and count for that age|
| Average Age Analysis | This procedure returns the average age ofdomains, overall or per regisrar| JSON object string containing the registrars, zone and rank    | JSON of registrar, average age and overall count|

## Changes

* 17/05 
  * 20:11: Registrar Transactions: Added parameter cleaning and default settings
  * 20:45: Registrar Transactions: Added initial query
  * 21:13: Registrar Transactions: Deployed
* 18/05
  * Creates per Registrar
  * Renewals per Registar
* 20/05
  * Deletion for Registrars 
* 21/05
  * Transformation into ChartJS format 
* 22/05 
  * Dashboard
* 30/05 
  * Debugging Transaction procedure - undefined object
  * Fixed registrar grouping
  * Date From errors
  * Fixed timezone
* 11/06
  * Started Domain Name Analysis Procedure
  * Query for domain retrieval
* 17/06
  * Added per transaction query
  * Bug in transaction query- array of types only returns last
* 19/06
  * Bug  fixed for Monthly granularity
  * Overall dates fixed
* 21/06
  * Date formatting
* 22/06
  * Day granularity fixed
  * Domain name analysis query update 
* 25/06
  * Transaction  Deployed on AFRICA
  *  All views required for transaction procedure created
  * Debug procedure - working now
  * Basic Marketshare
  * Marketshare top and bottom rank
