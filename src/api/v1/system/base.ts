import { GetEmailCode, Login, Register } from "@/api/model/base/request"
import { CaptchaValue } from "@/api/model/base/response"
import { MEIS_http } from "@/utils/http/index"

export function getCaptcha() {
    return MEIS_http.post<CaptchaValue>({
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

export function login(params: Login) {
    return MEIS_http.post({
        url: getUrl("/login"),
        params,
    })
}

function getUrl(url: string) {
    return "/base" + url
}
