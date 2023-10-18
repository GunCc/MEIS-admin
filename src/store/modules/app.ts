import { defineStore } from "pinia"
import { store } from ".."

type themeType = "dark" | "light"

interface AppState {
    theme: themeType
}

export const appStore = defineStore({
    id: "app-store",
    state: (): AppState => ({
        theme: "light",
    }),
    getters: {
        getTheme(state: AppState): themeType {
            return state.theme
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
    },
})

export function appStoreOutset() {
    return appStore(store)
}
