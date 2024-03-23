import { BaseListRequest, GetById } from "@/api/model/commen/request"
import { GetUserInfo } from "@/api/model/system/user"
import { MEIS_http } from "@/utils/http"

export function getList(params: BaseListRequest) {
    return MEIS_http.post({
        url: getUrl("/getList"),
        params,
    })
}

export function removeAttendance(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/remove"),
        params,
    })
}

export function createAttendance(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/create"),
        params,
    })
}

export function updateAttendance(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/update"),
        params,
    })
}

function getUrl(url: string) {
    return "/oa/attendance" + url
}
