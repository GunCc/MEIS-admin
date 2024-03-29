import { AppRouteModule, AppRouteRecordRaw } from "@/router/types"
import { warn } from "@/utils/log"
import { EXCEPTION_COMPONENT, LAYOUT, getParentLayout } from "../const"
import { cloneDeep, omit } from "lodash"
import { RouteRecordNormalized, Router, createRouter, createWebHashHistory } from "vue-router"

const LayoutMap = new Map<string, () => Promise<typeof import("*.vue")>>()
LayoutMap.set("LAYOUT", LAYOUT)

let dynamicViewsModules: Record<string, () => Promise<Recordable>>

// 动态引入路由组件
export function asyncImportRoute(routes: AppRouteRecordRaw[] = []) {
    dynamicViewsModules =
        dynamicViewsModules || import.meta.glob("../../views/**/*.{vue,tsx}")
    if (routes.length == 0) return
    routes.forEach(item => {
        const { component, children, name } = item
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
        } else if (name) {
            item.component = getParentLayout()
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


// 将多级路由转换为二级路由
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
    const modules: AppRouteModule[] = cloneDeep(routeModules);
  
    for (let index = 0; index < modules.length; index++) {
      const routeModule = modules[index];
      // 判断级别是否 多级 路由
      if (!isMultipleRoute(routeModule)) {
        // 声明终止当前循环， 即跳过此次循环，进行下一轮
        continue;
      }
      // 路由等级提升
      promoteRouteLevel(routeModule);
    }
    return modules;
  }
  
  // Routing level upgrade
// 路由等级提升
function promoteRouteLevel(routeModule: AppRouteModule) {
    // Use vue-router to splice menus
    // 使用vue-router拼接菜单
    // createRouter 创建一个可以被 Vue 应用程序使用的路由实例
    let router: Router | null = createRouter({
      routes: [routeModule as unknown as RouteRecordNormalized],
      history: createWebHashHistory(),
    });
    // getRoutes： 获取所有 路由记录的完整列表。
    const routes = router.getRoutes();
    // 将所有子路由添加到二级路由
    addToChildren(routes, routeModule.children || [], routeModule);
    router = null;
  
    // omit lodash的函数 对传入的item对象的children进行删除
    routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
  }
  
  // Add all sub-routes to the secondary route
  // 将所有子路由添加到二级路由
  function addToChildren(
    routes: RouteRecordNormalized[],
    children: AppRouteRecordRaw[],
    routeModule: AppRouteModule,
  ) {
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      const route = routes.find((item) => item.name === child.name);
      if (!route) {
        continue;
      }
      routeModule.children = routeModule.children || [];
      if (!routeModule.children.find((item) => item.name === route.name)) {
        routeModule.children?.push(route as unknown as AppRouteModule);
      }
      if (child.children?.length) {
        addToChildren(routes, child.children, routeModule);
      }
    }
  }
  
  // Determine whether the level exceeds 2 levels
  // 判断级别是否超过2级
  function isMultipleRoute(routeModule: AppRouteModule) {
    // Reflect.has 与 in 操作符 相同, 用于检查一个对象(包括它原型链上)是否拥有某个属性
    if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
      return false;
    }
  
    const children = routeModule.children;
  
    let flag = false;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      if (child.children?.length) {
        flag = true;
        break;
      }
    }
    return flag;
  }
  