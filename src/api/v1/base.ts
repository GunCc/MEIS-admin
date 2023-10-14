import { GetEmailCode, Register } from "../model/request"
import { MEIS_http } from "./../../utils/http/index"

export function getCaptcha() {
    return MEIS_http.post({
        url: getUrl("/captcha"),
    })
}

export function sendEmailCode(params: GetEmailCode) {
    return MEIS_http.post({
        url: getUrl("/sendEmail"),
        params,
    })
}

export function register(params: Register) {
    return MEIS_http.post({
        url: getUrl("/register"),
        params,
    })
}

function getUrl(url: string) {
    return "/base" + url
}
