import { BaseListRequest } from "@/api/model/commen/request"
import { MEIS_http } from "@/utils/http"

export function getList(params: BaseListRequest) {
    return MEIS_http.post({
        url: getUrl("/getList"),
        params,
    })
}
function getUrl(url: string) {
    return "/user" + url
}
