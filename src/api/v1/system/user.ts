import { BaseListRequest, GetById } from "@/api/model/commen/request"
import { GetUserInfo } from "@/api/model/system/user"
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

// 获取用户信息
export function getUserInfo(){
    return MEIS_http.post<GetUserInfo>({
        url: getUrl("/getUserInfo"),
    })
}

function getUrl(url: string) {
    return "/user" + url
}
