import { BaseListRequest, GetById, GetByIds } from "@/api/model/commen/request"
import { OperationRecord } from "@/api/model/system/operationRecord"
import { MEIS_http } from "@/utils/http"

export function getList(params: BaseListRequest) {
    return MEIS_http.post<OperationRecord[]>({
        url: getUrl("/getList"),
        params,
    })
}

export function removeOperation(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/remove"),
        params,
    })
}

export function removeOperationByIds(params: GetByIds) {
    return MEIS_http.post({
        url: getUrl("/removeByids"),
        params,
    })
}

function getUrl(url: string) {
    return "/operationRecord" + url
}
