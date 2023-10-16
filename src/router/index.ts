import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import type { App } from "vue"
import { LoginRoute, asyncRoute } from "./routes"

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        redirect: "/login",
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: [...routes, ...LoginRoute, ...asyncRoute],
})

function setupRouter(app: App) {
    console.log(router)
    app.use(router)
}

export { setupRouter }
