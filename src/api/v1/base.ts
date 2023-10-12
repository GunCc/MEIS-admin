import { MEIS_http } from "./../../utils/http/index"

export function getCaptcha() {
    return MEIS_http.post({
        url: getUrl("/captcha"),
    })
}

function getUrl(url: string) {
    return "/base" + url
}
