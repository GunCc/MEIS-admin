import { createApp } from "vue"
import App from "./App.vue"
// import { createPinia } from "pinia"
import { setupRouter, router } from "./router"
import "virtual:windi.css"
import "@/design/index.scss"
import 'nprogress/nprogress.css'
import { setupStore } from "./store/index"
import { setupRouterGuard } from "./router/guard"

// 启动项目
async function init() {
    const app = createApp(App)

    setupRouter(app)

    // 设置路由守卫
    setupRouterGuard(router)

    // 调用store
    setupStore(app)

    // 挂载vue
    app.mount("#app")
}

init()
