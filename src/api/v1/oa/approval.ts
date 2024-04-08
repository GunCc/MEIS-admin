import { BaseListRequest, GetById } from "@/api/model/commen/request"
import { MEIS_http } from "@/utils/http"

export function getList(params: BaseListRequest) {
    return MEIS_http.post({
        url: getUrl("/getList"),
        params,
    })
}

export function updateApproval(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/update"),
        params,
    })
}

function getUrl(url: string) {
    return "/oa/approval" + url
}
