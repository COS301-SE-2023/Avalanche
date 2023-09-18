import { CountryEnum } from "@/Enums/Countries"

export default interface IRegisterRequest {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
}