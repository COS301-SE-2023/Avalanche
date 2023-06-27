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
### Create organisation Request
```ts
interface ICreateOrganisationRequest {
  name : string
},
header : JWToken
```
### Create organisation Response
```ts
interface ICreateOrganisationResponse {
  status: string,
  message: string,
  timestamp: number
}
```
### Create user group Request
```ts
interface ICreateUserGroupRequest {
  name : string,
  permisssion : number //1 = admin, 2 = other
},
header : JWToken
```
### Create user group Response
```ts
interface ICreateUserGroupResponse {
  status: string,
  message: string,
  timestamp: number
}
```
### Add user to user group Request
```ts
interface IAddUserToUserGroupRequest {
  userEmail : string,
  userGroupName : string
  //here you need to check if the user has a permission level of 1 based on any their user groups
  //I also check this in the api
},
header : JWToken
```
### Add user to user group Response
```ts
interface IAddUserToUserGroupResponse {
  status: string,
  message: string,
  timestamp: number
}
```
### Exit user group Request
```ts
interface IExitUserGroupRequest {
  userGroupName : string
},
header : JWToken
```
### Exit user group Response
```ts
interface IExitUserGroupResponse {
  status: string,
  message: string,
  timestamp: number
}
```
### Remove user from user group Request
```ts
interface IRemoveUserfromUserGroupRequest {
  userEmail : string,
  userGroupName : string
  //here you need to check if the user has a permission level of 1 based on any their user groups
  //I also check this in the api
},
header : JWToken
```
### Remove user from user group Response
```ts
interface IRemoveUserFromUserGroupResponse {
  status: string,
  message: string,
  timestamp: number
}
```
### Add user to user group with key Request
```ts
interface IAddUserToUserGroupWithKeyRequest {
  key : string
},
header : JWToken
```
### Add user to user group with key Response
```ts
interface IAddUserToUserGroupResponse {
  status: string,
  message: string,
  timestamp: number
}
```
### Integrate with DNS API Request
```ts
interface IIntegrateWithDNSAPIRequest {
  type : DataProductEnum,
  allocateToName : string //either email of the user or the name of the user group
  username : string,
  password : string,
  personal : boolean //true is for user, false is for user group
},
header : JWToken
```
### Integrate with DNS API Response
```ts
interface IIntegrateWithDNSAPIResponse {
  status: string,
  message: string,
  timestamp: number
}
```
### Integrate with data product Request
```ts
interface IIntegrateWithDataProductRequest {
  type : DataProductEnum,
  allocateToName : string //either email of the user or the name of the user group
  personal : boolean //true is for user, false is for user group
},
header : JWToken
```
### Integrate with data product Response
```ts
interface IIntegrateWithDataProductResponse {
  status: string,
  message: string,
  timestamp: number
}
```
## 2. Domain watch
### Domain watch list Request
```ts
interface IDomainWatchListRequest {
  domain : string,
  type : [types : ALGOType, threshold : number]
},
header : JWToken
```
### Domain watch list Response
```ts
interface IDomainWatchListResponse {
  status: string,
  data: string,
  timestamp: number
}
```
## 3. Snowflake
### Transactions Request
```ts
interface ITransactionsRequest {
  registrar : string,
  zone : WarehouseEnum,
  dateFrom : string //format yyyy-mm-dd
  dateTo : string //format yyyy-mm-dd
  granularity : string //year, month, week
  group : string,
  transactions : [strings],
  graphName: string
},
header : JWToken
```
### Transacrtions Response
```ts
interface ITransactionsResponse {
  status: string,
  message: string,
  timestamp: number
}
```
```ts
interface ISettings:
  theme: ThemeEnum,
  graph: GraphSettingsEnum
```
## 2. Data for dashboard requests 
```ts
interface IDashboardRequest:
{
   userId: number,
   dashboardName: string
}
```
```ts
interface IDashBoardResponse:
{
   name: string,
   id: number,
   graphs: IGraphs[],
   graphsFilter: [{graphs.name, filters}]
}
```
## 3. Graph data format:
```ts
interface IEnumWarehouse:
{
   ZACR: "ZACR",
   AFRICA: "AFRICA",
   RyCE: "RyCE"
}
```
```ts
interface IGraphs:
{
   name: string,
   warehouse: EnumWarehouse,
   data: IGraphData
}
```
```ts
interface IGraphData
{
   labels: string[],
   datasets: IDataSet[],
   comments: IComment[]
   
}
```
```ts 
interface IDataSet
{
  label: string,
  data: number[] | otherDataType[]
}
```
```ts
interface IComment
{
  userId: string,
  userName: string,
  comment: string,
  createdAt: Timestamp
}
```
```ts
interface IGraphBackendRequest:
{
    registrar?: string,
    zone?: string,
    dateFrom?: string,
    dateTo?: string,
    granularity?: string,
    groupBy?: string
}
```
```ts
interface IGraphFrontendRequest:
{
  zone : string,
  warehouse : EnumWarehouse,
  name: string,
  filters : IFilter
}
```
```ts
interface IFilter:
{
  dateTo : string,
  dateFrom : string,
  granularity: string,
  registrar : string
}
```
## 4. Domain Watch:
```ts
interface IDomain
{
  domain: string,
}
```
```ts
enum AlgoType {
  LEV = "Levenshtein"
}
```
```ts
interface IDomainWatchType
{
  type: AlgoType,
  threshold: number
}
```
```ts
interface IDnsWatchRequest
{
  domain: string,
  types : IDomainWatchType[],
}
```
```ts
interface IDnsWatchResponse
{
  domains: string[],
  distance: string[],
}
```
## 5. Snowflake
```ts
interface ITransactionRequest
{
    registrars: string[], //registrarIDs
    transactions: string[], // create, grace, redeem, transfer, renew
    zone: string, // "ZoneName"
    dateFrom: string //"yyyy-mm-dd",
    dateTo: string, //"yyyy-mm-dd",
    granularity :string // "day | month | week | year",
    group : string //"registrar"/ "all"
}
```
```ts
interface IDomainWatchRequest
{
   granularity: string // day/week/month/year
   num:number //number of days, weeks, months or years back you want
}
```
## 6. Domain Name Analysis:
```ts
interface IDomainNameAnalysisListRequest
{
    minimumAppearances: number,
    data: string[]
}
```
```ts
interface IDomainNameAnalysisListResponse
{
    status: string, //success||failure
    data: domainNameAnalysisListDataInterface[]
}
```
```ts
interface IDomainNameAnalysisListDataInterface
{
    word: string, 
    frequency: number,
    domains: string[]
}
```
```ts
interface IDomainNameAnalysisClassifyRequest
{
    data: string[],
    labels?: string[],
    minimumConfidence?: number
}
```
```ts
interface IDomainNameAnalysisClassifyResponse
{
    status: string,//request
    data: IDomainNameAnalysisListDataInterface[]
}
```
```ts
interface IDomainNameAnalysisListDataInterface
{
    domain: string,//request
    labels: string[],
    score:  number[]
}
```
