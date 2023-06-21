import { IOrganisation } from "../interfaces"

export default interface ICreateOrgnisationResponse {
    status: string,
    message: IOrganisation,
    timestamp: string
}