import { CountryEnum } from "@/Enums/Countries"

export default interface RegisterRequest {
    email: string,
    confirmEmail: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string,
    country: CountryEnum
}