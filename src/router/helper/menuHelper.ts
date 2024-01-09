import { MenuItem } from "@/components/Menu/src/types"
import { AppRouteRecordRaw } from "../types"
import { LAYOUT_NAME } from "../const"
export function genLayoutMenus(menus: AppRouteRecordRaw[]): MenuItem[] {
    let menuList: MenuItem[] = []
    let menuItem: MenuItem

    if (menus && menus.length != 0) {
        for (let key in menus) {
            let item = menus[key]
            menuItem = {
                path: item.path,
                title: item.meta.title,
                key: item.path,
            }
            // 1. 如果重定向或着component是Layout那么一定要有子组件 要不不成为路由
            if (item.component.name == LAYOUT_NAME && item.redirect == "") {
                continue
            }

            // 2. 如果有孩子递归生成目录
            if (item.children && item.children.length != 0) {
                menuItem.children = genLayoutMenus(item.children)
            }
            // 3. 如果是最后一层直接放回给上一级
            menuList.push(menuItem)
        }
    }
    return menuList
}
