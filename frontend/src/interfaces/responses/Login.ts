import { APIStatus as APIStatusEnum } from "@/Enums";
import { IUser, IUserState } from "@/store/Slices/userSlice";

export default interface LoginResponse {
    stuatus: APIStatusEnum,
    userWithToken: IUserState
}