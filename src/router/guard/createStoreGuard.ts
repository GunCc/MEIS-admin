import { PageEnum } from "@/enums/pageEnum"
import { removeTabChangeListener } from "@/logic/mitt/routeChange"
import { useAppStore } from "@/store/modules/app"
import { menuStore } from "@/store/modules/menu"
import { mutipleStore } from "@/store/modules/mutipleTab"
import { userStore } from "@/store/modules/user"
import { Router } from "vue-router"

export async function createStoreGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        if (to.name == PageEnum.BASE_LOGIN) {
            const useMultipleStore = mutipleStore()
            const useUserStore = userStore()
            // const appStore = useAppStore()
            const useMenuStore = menuStore()

            useMultipleStore.clearTab()
            useMenuStore.clearMenuStore()
            useUserStore.clearUser()

            removeTabChangeListener();
            next()
        }
    })
}
