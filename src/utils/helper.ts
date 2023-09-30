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
