import { AppRouteRecordRaw } from "@/router/types"
import { warn } from "@/utils/log"
import { EXCEPTION_COMPONENT, LAYOUT } from "../const"

const LayoutMap = new Map<string, () => Promise<typeof import("*.vue")>>()
LayoutMap.set("LAYOUT", LAYOUT)

let dynamicViewsModules: Record<string, () => Promise<Recordable>>

// 动态引入路由组件
export function asyncImportRoute(routes: AppRouteRecordRaw[] = []) {
    dynamicViewsModules =
        dynamicViewsModules || import.meta.glob("../../views/**/*.{vue,tsx}")
    if (routes.length == 0) return
    routes.forEach(item => {
        const { component, children } = item
        if (component) {
            const layoutFound = LayoutMap.get(component.toUpperCase())
            if (layoutFound) {
                item.component = layoutFound
            } else {
                item.component = dynamicImport(
                    dynamicViewsModules,
                    component as string
                )
            }
        }
        children && asyncImportRoute(children)
    })
}

// 动态引入路由组件
export function dynamicImport(
    dynamicViewsModules: Record<string, () => Promise<Recordable>>,
    component: string
) {
    const keys = Object.keys(dynamicViewsModules)
    const matchKeys = keys.filter(key => {
        const k = key.replace("../../views", "")
        const startFlag = component.startsWith("/")
        const endFlag = component.endsWith(".vue") || component.endsWith(".tsx")
        const startIndex = startFlag ? 0 : 1
        const lastIndex = endFlag ? k.length : k.lastIndexOf(".")
        return k.substring(startIndex, lastIndex) === component
    })
    if (matchKeys?.length === 1) {
        const matchKey = matchKeys[0]
        return dynamicViewsModules[matchKey]
    } else if (matchKeys?.length > 1) {
        warn(
            "Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure"
        )
        return
    } else {
        warn(
            "在src/views/下找不到`" +
                component +
                ".vue` 或 `" +
                component +
                ".tsx`, 请自行创建!"
        )
        return EXCEPTION_COMPONENT
    }
}
