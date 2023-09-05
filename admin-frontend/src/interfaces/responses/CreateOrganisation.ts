import { IUser } from "@/store/Slices/userSlice"
import { IOrganisation } from "../interfaces"

export default interface ICreateOrgnisationResponse {
    status: string,
    message: IUser,
    timestamp: string
}