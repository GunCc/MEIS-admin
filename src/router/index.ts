import { createRouter, createWebHashHistory } from "vue-router"
import type { App } from "vue"
import { LoginRoute } from "./routes"

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [...LoginRoute],
})

function setupRouter(app: App) {
    app.use(router)
}

export { setupRouter }
