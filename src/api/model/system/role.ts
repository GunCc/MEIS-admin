import { GlobalModal } from "../commen/response"

export interface Role extends GlobalModal {
    name: string
    comment: string
}

export interface RoleBindMenus {
    role_id: number
    menu_ids: number[]
}
