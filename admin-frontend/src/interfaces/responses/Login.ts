import { APIStatus as APIStatusEnum } from "@/Enums";
import { IUser, IUserState } from "@/store/Slices/userSlice";

export default interface ILoginResponse {
    [x: string]: any;
    stuatus: APIStatusEnum,
    userWithToken: IUserState,
    timestamp: number
}