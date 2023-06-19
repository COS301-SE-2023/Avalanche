[go back](readme.md)

# Interfaces

## 1. User Register and Management

### IUser
```ts
interface IUser {
  id: string,
  email: string,
  firstName: string,
  lastName: strings
  settings: ISettings,
  profilePicture: string | null,
  favourites: IDashBoard[] | null,
  dataProducts: IDataProducts[] | null,
  organisation: IOrganisation | null,
  userGroups: IUserGroups[] | null,
}
```
### IUserResponse
```ts
interface IUser {
  id: string,
  email: string,
  firstName: string,
  lastName: strings
  settings: ISettings,
  profilePicture: string | null,
  favourites: IDashBoard[] | null,
  dataProducts: IDataProducts[] | null,
  organisation: IOrganisation | null,
  userGroups: IUserGroups[] | null,
  token: string
}
```
### IUserGroups
```ts
interface IUserGroups {
  name: string,
  organisation: IOrganisation,
  permission: number,
  organisationId: number,
  users: IUsers.id[],
  id: number
}
```
### IOrganisation
```ts
interface IOrganisation {
  name: string,
  id: number,
}
```
### IDataProduct
```ts
interface IDataProduct {
  dataProductName: DataProductEnum
  registrarName : string | null
}
```
### DataProductEnum
```ts
enum DataProductEnum {
  ZARCRegistrar = "ZARCRegistrar",
  AFRICARegistrar = "AFRICARegistrar",
  RyCERegistrar = "RYCERegistrar",
  DomainWatch = "DomainWatch"
}
```
### ThemeEnum
```ts
enum ThemeEnum {
  DARK = "dark",
  LIGHT = "light"
}
```
### Settings
```ts
interface ISettings {
  theme: ThemeEnum
}
```

## Dashboard

## Graph Data
```ts
enum Warehouse {
  ZACR = "ZACR",
  AFRICA = "AFRICA",
  RyCE: "RyCE"
}
```

```ts
interface IGraphs {
  name: string,
  id: number,
  warehouse: EnumWarehouse,
  data: IGraphData
}
```

```ts
interface IGraphData {
  labels: string[],
  datasets: IDataSet[],
  comments: IComment[]
}
```

```ts
interface IDataSet {
  label: string,
  data: number[] | otherDataType[]
}
```

```ts
interface IComment {
  userId: string,
  comment: string,
  createdAt: Timestamp
}
```

## Settings
### API Object
```ts
interface IApi {
  id: string,
  name: string,
  description: string,
  createdAt: number,
  key?: string, // this will only be stored in the database, and will not be shown to the user always, will only be shown when they create the api key
}
```
