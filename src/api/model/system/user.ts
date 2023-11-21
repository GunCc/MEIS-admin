import { UserInfo } from "@/api/model/base/response"
import { Menu } from "./menu"
export interface GetUserInfo {
    user: UserInfo
    menus: Menu[]
}
