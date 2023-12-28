import { login } from "@/api/v1/system/base"
import { getUserInfo } from "@/api/v1/system/user"
import { defineStore } from "pinia"
import { store } from ".."
import { Nullable } from "vitest"
import { Login } from "@/api/model/base/request"
import { UserInfo } from "@/api/model/base/response"
import { router } from "@/router/index"
import { PageEnum } from "@/enums/pageEnum"
import { getAuthCache, setAuthCache } from "@/utils/auth"
import { TOKEN_KEY } from "@/enums/cacheEnum"
import { menuStore } from "./menu"

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
        getUserInfo(state): Nullable<UserInfo> {
            return state.userInfo || null
        },
        getToken(state): string {
            return state.token || getAuthCache<string>(TOKEN_KEY)
        },
    },
    actions: {
        setUserInfo(userInfo: UserInfo | null) {
            this.userInfo = userInfo
        },
        setToken(token: string | undefined) {
            this.token = token ? token : ''; // for null or undefined value
            setAuthCache(TOKEN_KEY, token);
        },
        async handleLogin(params: Login) {
            try {
                const res = await login(params)
                const { token } = res
                this.setToken(token)
                await this.handleLoginAfter(true)
            } catch (error) {
                throw new Error(error as string)
            }
        },
        async handleLoginAfter(goHome?: boolean) {
            if (!this.getToken) return

            const useMenuStore = menuStore()
            const res = await getUserInfo()
            const { user, menus } = res
            this.setUserInfo(user)
            useMenuStore.setDefaultMenu(menus)
            const { redirect = PageEnum.BASE_HOME } = this.getUserInfo || {}
            goHome && (await router.replace(redirect || PageEnum.BASE_HOME))
        },
        // 登出操作
        async logout() {
            const useMenuStore = menuStore()
            this.setUserInfo(null)
            this.setToken(undefined)
            useMenuStore.clearMenuStore()
            router.replace(PageEnum.BASE_ADMIN_LOGIN)
        },
    },
})

// 在外部使用store
export function userStoreOutset() {
    return userStore(store)
}
