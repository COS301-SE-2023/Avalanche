import { APIStatus } from "@/Enums"

export default interface IOTPVerifyResponse {
    status: APIStatus,
    message: string,
    timestamp: number
}