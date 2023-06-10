import { APIStatus as APIStatusEnum } from "@/Enums";
import { IUserState } from "@/store/Slices/userSlice";

export default interface LoginResponse {
    stuatus: APIStatusEnum,
    data?: IUserState,
    message?: string,
    timestamp: EpochTimeStamp
}