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

## Changes

17/05 20:11: Registrar Transactions: Added parameter cleaning and default settings
      20:45: Registrar Transactions: Added initial query
