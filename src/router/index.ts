import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import type { App } from "vue"
import { LoginRoute } from "./routes"
import baseRoutes from './routes/modules/base';

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        redirect: "/login",
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [...routes, ...LoginRoute,...baseRoutes],
})

function setupRouter(app: App) {
    app.use(router)
}

export { setupRouter }
