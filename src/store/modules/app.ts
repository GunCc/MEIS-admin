import { PROJ_CFG_KEY } from "@/enums/cacheEnum"
import { TransitionSetting, ProjectSetting, FormSetting } from "@/types/config"
import { deepMerge } from "@/utils"
import { Persistent } from "@/utils/cache/persistent"
import { defineStore } from "pinia"
import { store } from ".."
import { checkDB, initDB } from "@/api/v1/system/init"
import { InitDB } from "@/api/model/system/init"
import { useGo } from "@/hooks/web/usePage"
import { router } from "@/router"

type themeType = "dark" | "light"

interface AppState {
    theme: themeType
    projectSetting: ProjectSetting | null | undefined
    // 是否需要初始化数据库
    needInitDB: boolean
    // 是否已经动态获取
    isDyamicDB: boolean
}

export const useAppStore = defineStore({
    id: "app-store",
    state: (): AppState => ({
        theme: "light",
        projectSetting: Persistent.getLocal(PROJ_CFG_KEY),
        needInitDB: false,
        isDyamicDB: false,
    }),
    getters: {
        getTheme(state: AppState): themeType {
            return state.theme
        },
        getProjectConfig(state): ProjectSetting {
            return state.projectSetting || ({} as ProjectSetting)
        },
        getTransitionSetting(): TransitionSetting {
            return this.getProjectConfig.transitionSetting
        },
        getFormSetting(): FormSetting {
            return this.getProjectConfig.formSetting
        },
        getNeedInitDB(state: AppState): boolean {
            return state.needInitDB
        },
        getIsDyamicDB(state: AppState): boolean {
            return state.isDyamicDB
        },
    },
    actions: {
        setTheme(theme: boolean) {
            this.theme = theme ? "dark" : "light"
            const html = document.querySelector("html") as HTMLHtmlElement
            if (this.getTheme == "dark") {
                html.classList.add("dark")
            } else {
                html.classList.remove("dark")
            }
        },
        setProjectConfig(config: DeepPartial<ProjectSetting>) {
            this.projectSetting = deepMerge(
                this.projectSetting || {},
                config
            ) as ProjectSetting
            Persistent.setLocal(PROJ_CFG_KEY, this.projectSetting)
        },
        setIsDyamicDB(flag: boolean) {
            this.isDyamicDB = flag
        },
        setNeedInitDB(flag: boolean) {
            this.needInitDB = flag
        },
        async getNeedInitDBStatus() {
            try {
                const res = await checkDB()
                this.setNeedInitDB(res.needInit)
            } catch (e) {
                throw new Error(e as string)
            } finally {
                this.setIsDyamicDB(true)
            }
        },
        async handleInitDB(params: InitDB) {
            try {
                const res = await initDB(params)
                this.setNeedInitDB(res.needInit)
                await router.replace("/login-admin")
            } catch (e) {
                throw new Error(e as string)
            }
        },
    },
})

export function appStoreOutset() {
    return useAppStore(store)
}
