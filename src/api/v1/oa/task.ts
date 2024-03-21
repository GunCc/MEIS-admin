import { BaseListRequest, GetById } from "@/api/model/commen/request"
import { GetUserInfo } from "@/api/model/system/user"
import { MEIS_http } from "@/utils/http"

export function getList(params: BaseListRequest) {
    return MEIS_http.post({
        url: getUrl("/getList"),
        params,
    })
}

export function removeTask(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/remove"),
        params,
    })
}

export function createTask(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/create"),
        params,
    })
}

export function updateTask(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/update"),
        params,
    })
}


export function getInfo(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/update"),
        params,
    })
}

function getUrl(url: string) {
    return "/oa/task" + url
}
