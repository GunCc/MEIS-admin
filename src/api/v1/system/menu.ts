import { Menu } from "@/api/model/system/menu"
import { MEIS_http } from "@/utils/http"

export function getList() {
    return MEIS_http.post({
        url: getUrl("/getList"),
    })
}



export function removeMenu(params: Menu) {
    return MEIS_http.post({
        url: getUrl("/remove"),
        params,
    })
}

export function createMenu(params: Menu) {
    return MEIS_http.post({
        url: getUrl("/create"),
        params,
    })
}

export function updateMenu(params: Partial<Menu>) {
    return MEIS_http.post({
        url: getUrl("/update"),
        params,
    })
}

function getUrl(url: string) {
    return "/menu" + url
}
