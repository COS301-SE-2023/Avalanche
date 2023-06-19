[go back](readme.md)

# Contracts
## 1. User Register and Management
  - Authentication object
  - Basic user info:
     - First Name
     - Last Name
  - Settings (under user)
  - Favourite graphs

### Register Request
```ts
interface IRegisterRequest {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  country : countryEnum
}
```
### Register Response
```ts
interface IRegisterResponse {
  status: string,
  message: string,
  timestamp: number
}
```
### Login Request
```ts
interface ILoginRequest {
  email: string,
  password: string
}
```
### Login Response
```ts
interface ILoginResponse {
  status: string,
  timestamp: number,
  userWithToken: IUserResponse
}
```
### Verify OTP Request
```ts
interface IOTPVerifyRequest{
  email: string,
  otp: string
}
```
### Verify OTP Response
```ts
interface IOTPVerifyResponse {
  status: string,
  message: string,
  timestamp: number
}
```
### Create API Key Request
```ts
interface ICreateApiRequest {
  name: string,
  description: string
}
```
### Create API Key Response
```ts
interface ICreateApiResponse {
  id: string,
  name: string,
  description: string,
  createdAt: number,
  key: string
}
```
### Delete API Key Request
```ts
interface IDeleteApiRequest {
  id: string
}
```
### Delete API Key Response
```ts
interface IDeleteApiResponse {
  status: string,
  message: string,
  timestamp: number
}
```
### Roll API Key Request
```ts
interface IRollApiRequest {
  id: string
}
```
### Roll API Key Response
```ts
interface IRollApiResponse {
  status: string,
  message: string,
  timestamp: number
}
```
```
ISettings:
  theme: ThemeEnum,
  graph: GraphSettingsEnum
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
