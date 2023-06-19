import { APIStatus as APIStatusEnum } from "@/Enums";
import { IUser, IUserState } from "@/store/Slices/userSlice";

export default interface ILoginResponse {
    stuatus: APIStatusEnum,
    userWithToken: IUserState,
    timestamp: number
}