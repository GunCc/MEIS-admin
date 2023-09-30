import { createApp } from "vue"
import App from "./App.vue"
// import { createPinia } from "pinia"
import { setupRouter } from "./router"
import "virtual:windi.css"
import "@/design/index.scss"


// 启动项目
async function init() {
    const app = createApp(App)

    setupRouter(app)

    // 挂载vue
    app.mount("#app")
}

init()
