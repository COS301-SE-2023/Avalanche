import { APIStatus as APIStatusEnum } from "@/Enums";

export default interface ILoginResponse {
    [x: string]: any;
    stuatus: APIStatusEnum,
    timestamp: number
}