import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router"
import type { App } from "vue"
import { basicRoutes } from "./routes"

export const router = createRouter({
    history: createWebHashHistory(),
    routes: basicRoutes as unknown as RouteRecordRaw[],
})

function setupRouter(app: App) {
    app.use(router)
}

export { setupRouter }
