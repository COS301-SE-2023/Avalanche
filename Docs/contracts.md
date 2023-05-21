# Contracts
## 1. User
  - Authentication object
  - Basic user info:
     - First Name
     - Last Name
  - Settings (under user)
  - Favourite graphs
```
IRegister:
{
  email: string,
  hashedPassword: string,
  firstName: string,
  lastName: string
}
```
```
ILogin:
{
  email: string,
  hashedPassword: string
}
```
```
IVerify:
{
  email: string,
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
  dataProductName: string,
  registryName?: string|null
}
```
## 2. Data for dashboard requests 
```
IDashboardRequest:
{
   name: string, 
   email: string
}
```
```
IDashBoardResponse:
{
   name: string,
   id: number,
   graphs: IGraphs[],
   graphsFilter: [{graphs.name, filters}]
}
```
## 3. Graph data format:
```
IWarehouse:
{
   ZACR: ZACR,
   AFRICA: AFRICA,
   RyCE: RyCE
}
```
```
IGraphs:
{
   name: string,
   id: number,
   warehouse: IWarehouse,
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
  comment: string,
  createdAt: Timestamp
}
```
