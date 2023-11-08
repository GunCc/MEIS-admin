import { PROJ_CFG_KEY } from "@/enums/cacheEnum"
import { TransitionSetting, ProjectSetting } from "@/types/config"
import { deepMerge } from "@/utils"
import { Persistent } from "@/utils/cache/persistent"
import { defineStore } from "pinia"
import { store } from ".."

type themeType = "dark" | "light"

interface AppState {
    theme: themeType
    ProjectSetting: ProjectSetting | null | undefined
}

export const useAppStore = defineStore({
    id: "app-store",
    state: (): AppState => ({
        theme: "light",
        ProjectSetting: Persistent.getLocal(PROJ_CFG_KEY),
    }),
    getters: {
        getTheme(state: AppState): themeType {
            return state.theme
        },
        getProjectConfig(state): ProjectSetting {
            return state.ProjectSetting || ({} as ProjectSetting)
        },
        getTransitionSetting(): TransitionSetting {
            return this.getProjectConfig.transitionSetting
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
            this.ProjectSetting = deepMerge(this.ProjectSetting || {}, config)
            Persistent.setLocal(PROJ_CFG_KEY, this.ProjectSetting)
        },
    },
})

export function appStoreOutset() {
    return useAppStore(store)
}
