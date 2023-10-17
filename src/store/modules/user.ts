import { login } from "@/api/v1/base"
import { defineStore } from "pinia"
import { store } from ".."
import { Login } from "./../../api/model/base/request"
import { Nullable } from "vitest"
import { UserInfo } from "@/api/model/base/response"
import { router } from "./../../router/index"
import { PageEnum } from "@/enums/pageEnum"

interface UserState {
    token?: string
    userInfo: Nullable<UserInfo>
}

export const userStore = defineStore({
    id: "user-store",
    state: (): UserState => ({
        token: undefined,
        userInfo: null,
    }),
    getters: {
        getUserInfo(state): UserInfo {
            return state.userInfo || {}
        },
        getToken(state): string {
            return state.token || ""
        },
    },
    actions: {
        setUserInfo(userInfo: UserInfo | null) {
            this.userInfo = userInfo
        },
        setToken(token: string) {
            this.token = token
        },
        async handleLogin(params: Login) {

            try {
                const res = await login(params)
                const { token, user } = res
                this.setToken(token)
                this.setUserInfo(user)
                this.handleLoginAfter()
            } catch (error) {
                console.error(error)
            }
        },
        async handleLoginAfter() {
            if (!this.getToken) return

            const { redirect = PageEnum.BASE_HOME } = this.getUserInfo
            console.log(redirect, "123")

            await router.replace(redirect || PageEnum.BASE_HOME)
        },
    },
})

// 在外部使用store
export function userStoreOutset() {
    return userStore(store)
}
