import { MenuItem } from "@/components/Menu/src/types"
import { AppRouteRecordRaw } from "../types"
export function genLayoutMenus(menus: AppRouteRecordRaw[]): MenuItem[] {
    let menuList: MenuItem[] = []
    let menuItem: MenuItem
    menus &&
        menus.length != 0 &&
        menus.forEach(item => {
            menuItem = {
                path: item.path,
                title: item.meta.title,
                key: item.path,
            }
            if (item.children && item.children.length != 0)
                menuItem.children = genLayoutMenus(item.children)
            menuList.push(menuItem)
        })
    return menuList
}
