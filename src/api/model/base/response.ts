import { PageEnum } from "@/enums/pageEnum"

export interface CaptchaValue {
    captcha_id: string
    image_path: string
}

export interface UserInfo {
    id: number
    uuid: string
    username: string
    avatar: string
    nickname: string
    email: string
    enable: number
    role: Recordable
    redirect: PageEnum
}
