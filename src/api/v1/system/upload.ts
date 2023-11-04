import { BaseListRequest, GetById } from "@/api/model/commen/request"
import { MEIS_http } from "@/utils/http"
import { FileBindType, FileEdit, ResourceType } from "./../../model/upload/request"

export function getFileType() {
    return MEIS_http.post({
        url: getUrl("/getFileType"),
    })
}

export function removeFileType(params: GetById) {
    return MEIS_http.post({
        url: getUrl("/removeFileType"),
        params,
    })
}

export function updateFileType(params: ResourceType) {
    return MEIS_http.post({
        url: getUrl("/updateFileType"),
        params,
    })
}

export function addFileType(params: Omit<ResourceType, "id">) {
    return MEIS_http.post({
        url: getUrl("/addFileType"),
        params,
    })
}

export function fileBindType(params: FileBindType) {
    return MEIS_http.post({
        url: getUrl("/fileBindType"),
        params,
    })
}

export function getFileList(params: Omit<BaseListRequest, "keyword">) {
    return MEIS_http.post({
        url: getUrl("/list"),
        params,
    })
}

export function updateFile(params: FileEdit) {
    return MEIS_http.post({
        url: getUrl("/update"),
        params,
    })
}



function getUrl(url: string) {
    return "/resource" + url
}
