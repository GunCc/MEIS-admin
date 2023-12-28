import { InitDB } from "@/api/model/system/init"
import { MEIS_http } from "@/utils/http"

export function initDB(params: InitDB) {
    return MEIS_http.post({
        url: getUrl("/initdb"),
        params,
    })
}

export function checkDB() {
    return MEIS_http.post(
        {
            url: getUrl("/initcheck"),
        },
        {
            messageModal: "none",
        }
    )
}

function getUrl(url: string) {
    return "/init" + url
}
