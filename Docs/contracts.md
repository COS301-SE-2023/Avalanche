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
  hashedPassword: string,
  firstName: string,
  lastName: string
}
```
```
Login Request:
{
  email: string,
  hashedPassword: string
}
```
```
Login Response:
{
  message: string,
  user?: IUser
}
```
```
Verify Request:
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
## 2. Data for dashboard requests 
```
Dashboard Request:
{
   name: string, 
   email: string,
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
  comment: string,
  createdAt: Timestamp
}
```
