[go back](readme.md)

# Interfaces

## 1. User Register and Management

### IUser

```typescript
interface IUser {
	email: string,
  	firstName: string,
	lastName: strings
	settings: ISettings,
	profilePicture: string | null,
   	favourites: IDashBoard[] | null,
   	dataProducts: IDataProducts[] | null,
   	organisationId: number | null,
   	organisation: IOrganisation | null,
   	userGroupId: number[] | null,
   	userGroups: IUserGroups[] | null,
}
```

### IUserGroups

```typescript
interface IUserGroups {
   	name: string,
   	organisation: IOrganisation,
   	permission: number,
   	organisationId: number,
   	users: IUsers[],
   	id: number
}
```

### IOrganisation

```typescript
interface IOrganisation {
	name: string,
	id: number,
}
```

### IDataProduct

```typescript
interface IDataProduct {
	dataProductName: DataProductEnum
}
```

### DataProductEnum

```typescript
enum DataProductEnum {
	ZARCRegistrar = "ZARCRegistrar",
  	AFRICARegistrar = "AFRICARegistrar",
  	RyCERegistrar = "RYCERegistrar",
  	DomainWatch = "DomainWatch"
}
```

## Dashboard

## Graph Data

```typescript
enum Warehouse {
   	ZACR = "ZACR",
   	AFRICA = "AFRICA",
   	RyCE: "RyCE"
}
```

```typescript
interface IGraphs {
   	name: string,
   	id: number,
   	warehouse: EnumWarehouse,
   	data: IGraphData
}
```

```typescript
interface IGraphData {
   	labels: string[],
   	datasets: IDataSet[],
   	comments: IComment[]
}
```

```typescript
interface IDataSet {
  	label: string,
  	data: number[] | otherDataType[]
}
```

```typescript
interface IComment {
  	userId: string,
  	comment: string,
  	createdAt: Timestamp
}
```
