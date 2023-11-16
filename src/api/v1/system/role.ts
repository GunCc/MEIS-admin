import { BaseListRequest, GetById } from "@/api/model/commen/request"
import { Role, RoleBindMenus } from "@/api/model/system/role"
import { MEIS_http } from "@/utils/http"
import { ALL_LIST_INFO } from "./../const"

export function getList(params: BaseListRequest) {
    return MEIS_http.post({
        url: getUrl("/getList"),
        params,
    })
}

export function getAllList() {
    return MEIS_http.post({
        url: getUrl("/getList"),
        params: ALL_LIST_INFO,
    })
}

export function removeRole(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/remove"),
        params,
    })
}

export function createRole(params: Role) {
    return MEIS_http.post({
        url: getUrl("/create"),
        params,
    })
}

export function updateRole(params: Partial<Role>) {
    return MEIS_http.post({
        url: getUrl("/update"),
        params,
    })
}

export function bindRoleMenus(params: Partial<RoleBindMenus>) {
    return MEIS_http.post({
        url: getUrl("/bindMenus"),
        params,
    })
}

function getUrl(url: string) {
    return "/role" + url
}
