import { GlobalModal } from "../commen/response"

export interface Menu extends GlobalModal {
    name: string
    path: string
    component: string
    sort: number
    hidden: boolean
    p_id: string
    children: Menu[]
}
