import { APIStatus } from "@/Enums"

export interface IOTPVerifyResponse {
    status: APIStatus,
    message: string
}