import { BaseListRequest, GetById } from "@/api/model/commen/request"
import { MEIS_http } from "@/utils/http"

export function getList(params: BaseListRequest) {
    return MEIS_http.post({
        url: getUrl("/getList"),
        params,
    })
}

export function removeUser(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/remove"),
        params,
    })
}

export function registerUser(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/registerAdmin"),
        params,
    })
}

export function updateUser(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/update"),
        params,
    })
}

// 重置密码
export function resetUserPassword(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/resetPassword"),
        params,
    })
}

function getUrl(url: string) {
    return "/user" + url
}
