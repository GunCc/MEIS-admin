import { GlobalModal } from "../commen/response"
import { UserInfo } from "@/api/model/base/response"

export interface OperationRecord extends GlobalModal {
    ip: string
    method: string
    path: string
    status: number
    latency: string
    agent: string
    error_message: string
    body: string
    resp: string
    user: UserInfo
}
