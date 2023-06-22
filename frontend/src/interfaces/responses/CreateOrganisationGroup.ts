import { IOrganisation } from "../interfaces"

interface IGroup {
    name: string,
    organisation: IOrganisation,
    permission: number,
    organisationId: number,
    products: null,
    id: number
}

export default interface ICreateUserGroupResponse {
    status: string,
    message: IGroup,
    timestamp: string,
}