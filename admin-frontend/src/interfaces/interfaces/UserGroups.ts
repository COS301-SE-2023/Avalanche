
import IOrganisation from "./Organisation"

export default interface IUserGroups {
    name: string,
    organisation: IOrganisation,
    permission: number,
    organisationId: number,
    // users: IUsers[],
    id: number
}