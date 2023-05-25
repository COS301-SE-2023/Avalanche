[go back](readme.md)

# Contracts
## 1. User Register and Management
  - Authentication object
  - Basic user info:
     - First Name
     - Last Name
  - Settings (under user)
  - Favourite graphs
```
Register Request:
{
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  country : countryEnum
}
```
```
Login Request:
{
  email: string,
  password: string
}
```
```
Login Response:
{
  message: string,
  success: boolean,
  user?: IUser
}
```
```
Verify Request:
{
  email: string,
  success: boolean,
  otp: string
}
```
```
IUser:
{
   email: string,
   firstName: string,
   lastName: strings
   settings: ISettings,
   favourites: IDashBoard[] | null,
   dataProducts: IDataProducts[] | null,
   organisationId: number | null,
   organisation: IOrganisation | null,
   userGroupId: number[] | null,
   userGroups: IUserGroups[] | null
}

```
```
IUserGroups:
{
   name: string,
   organisation: IOrganisation,
   permission: number,
   organisationId: number,
   users: IUsers[],
   id: number
}
```
```
IOrganisation:
{
   name: string,
   id: number
}
```
```
IDataProduct
{
  dataProductName: DataProductEnum

}
```
```
DataProductEnum
{
  ZARCRegistrar = 'ZARCRegistrar',
  AFRICARegistrar = 'AFRICARegistrar',
  RyCERegistrar = 'RYCERegistrar',
  DomainWatch = 'DomainWatch'
  
}
```
```
ISettings:
  theme: ThemeEnum,
  graph: GraphSettingsEnum
```
```
IApi:
  name: string,
  id: string,
  desc?: string,
  createdAt: timestamp
```
```
apiRequest:
  name: string,
  description: string
```
```
apiResponse:
  name: string,
  id: string,
  description: string,
  key: string
```
## 2. Data for dashboard requests 
```
Dashboard Request:
{
   userId: number,
   dashboardName: string
}
```
```
DashBoard Response:
{
   name: string,
   id: number,
   graphs: IGraphs[],
   graphsFilter: [{graphs.name, filters}]
}
```
## 3. Graph data format:
```
Enum Warehouse:
{
   ZACR: "ZACR",
   AFRICA: "AFRICA",
   RyCE: "RyCE"
}
```
```
IGraphs:
{
   name: string,
   warehouse: EnumWarehouse,
   data: IGraphData
}
```
```
IGraphData
{
   labels: string[],
   datasets: IDataSet[],
   comments: IComment[]
   
}
```
```
IDataSet
{
  label: string,
  data: number[] | otherDataType[]
}
```
```
IComment
{
  userId: string,
  userName: string,
  comment: string,
  createdAt: Timestamp
}
```
```
graphBackendRequest:
{
    registrar?: string,
    zone?: string,
    dateFrom?: string,
    dateTo?: string,
    granularity?: string,
    groupBy?: string
}
```
```
graphFrontendRequest:
{
  zone : string,
  warehouse : EnumWarehouse,
  name: string,
  filters : IFilter
}
```
```
IFilter:
{
  dateTo : string,
  dateFrom : string,
  granularity: string,
  registrar : string
}
```
## 4. Domain Watch:
```
IDomain
{
  domain: string,
}
```
```
enum AlgoType {
  LEV = "Levenshtein"
}
```
```
IDomainWatchType
{
  type: AlgoType,
  threshold: number
}
```
```
dnsWatchRequest
{
  domain: string,
  types : IDomainWatchType[],
}
```
```
dnsWatchResponse
{
  domains: string[],
  distance: string[],
}
```
