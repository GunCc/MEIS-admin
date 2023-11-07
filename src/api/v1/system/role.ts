import { BaseListRequest, GetById } from "@/api/model/commen/request"
import { Role } from "@/api/model/system/role"
import { MEIS_http } from "@/utils/http"

export function getList(params: BaseListRequest) {
    return MEIS_http.post({
        url: getUrl("/getList"),
        params,
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

function getUrl(url: string) {
    return "/role" + url
}
