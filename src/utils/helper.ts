import { cloneDeep, isArray, isObject, mergeWith } from "lodash"

// 递归合并两个对象
export function mergeData<
    T extends object | null | undefined,
    U extends object | null | undefined
>(target: T, source: U) {
    return mergeWith(cloneDeep(target), source, (objVal, nextVal) => {
        if (isObject(objVal) && isObject(nextVal)) {
            return mergeWith(
                cloneDeep(objVal),
                nextVal,
                (prevValue, nextValue) => {
                    return isArray(prevValue)
                        ? prevValue.concat(nextValue)
                        : undefined
                }
            )
        }
    })
}

// 扁平化数组
export function flattenArray<T>(arr: T[]) {
    if (!isArray(arr)) return []
    return arr.flat(1)
}

// 数组去重
export function repetitionArray<T>(arr: T[]) {
    if (!isArray(arr)) return []
    return [...new Set(arr)]
}
