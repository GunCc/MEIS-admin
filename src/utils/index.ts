import { cloneDeep, isObject, isArray, mergeWith } from "lodash"
import { RouteLocationNormalized, RouteRecordNormalized } from "vue-router"

/**

 递归合并两个对象。
 Recursively merge two objects.
 @param target 目标对象，合并后结果存放于此。The target object to merge into.
 @param source 要合并的源对象。The source object to merge from.
 @returns 合并后的对象。The merged object.
 */
export function deepMerge<
    T extends object | null | undefined,
    U extends object | null | undefined
>(target: T, source: U): T & U {
    return mergeWith(cloneDeep(target), source, (objValue, srcValue) => {
        if (isObject(objValue) && isObject(srcValue)) {
            return mergeWith(
                cloneDeep(objValue),
                srcValue,
                (prevValue, nextValue) => {
                    return isArray(prevValue)
                        ? prevValue.concat(nextValue)
                        : undefined
                }
            )
        }
    })
}

export function getRawRoute(
    route: RouteLocationNormalized
): RouteLocationNormalized {
    if (!route) return route
    const { matched, ...opt } = route
    return {
        ...opt,
        matched: (matched
            ? matched.map(item => ({
                  meta: item.meta,
                  name: item.name,
                  path: item.path,
              }))
            : undefined) as RouteRecordNormalized[],
    }
}
