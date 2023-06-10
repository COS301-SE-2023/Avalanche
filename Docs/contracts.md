# Contracts
## 1. User
  - Authentication object
  - Basic user info:
     - Profile picture
     - First Name
     - Last Name
  - Settings (under user)
  - Favourite graphs
```
IAuth:
{
  userId: string,
  email: string,
  hashedPassword: string,
  createdAt: Timestamp,
  lastLogin: Timestamp,
  lastActivity: Timestamp,
  verified: boolean
}
```
```
IUser:
{
   userId: string,
   firstName: string,
   lastName: string,
   profilePhoto: string | null,
   settings: ISettings,
   favourites: IGraphReq[] | null,
   integration: IIntegration[] | null,
   organisationId: string[] | null // should be returned upon integration? --> how do we verify that they are a registrar. 
   // after MVP subuser: string[] (userIds) | subUser[]
}

```
```
//After MVP
ISubUserRelationship:
{
   super: string
   sub: string
}
```
```
IIntegration
{
  registryName: string,
  registryId: string
}
```
## 2. Data for page requests 
```
PageRequest
{
   pageName: string, 
   userId: string
}
```
```
PageResponse
{
   pageName: string,
   graphs: IGraph[]
}
```
## 3. Graph data format:
```
IGraph
{
   graphName: string,
   graphDescription: string | null,
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
