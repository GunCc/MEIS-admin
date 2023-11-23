import { isNumber, set } from "lodash"
import { ComponentType } from "./componentMap"

// 将input内容转换为字符串
export function handleInputNumberValue(component?: ComponentType, val?: any) {
    if (!component) return val
    if (
        ["Input", "InputPassword", "InputSearch", "InputTextArea"].includes(
            component
        )
    ) {
        return val && isNumber(val) ? `${val}` : val
    }
    return val
}

// 尝试构建数组
export function tryConstructArray(
    field: string,
    values: Recordable = {}
): any[] | undefined {
    const pattern = /^\[(.+)\]$/
    if (pattern.test(field)) {
        const match = field.match(pattern)
        if (match && match[1]) {
            const keys = match[1].split(",")
            if (!keys.length) {
                return undefined
            }

            const result = []
            keys.forEach((k, index) => {
                set(result, index, values[k.trim()])
            })

            return result.length ? result : undefined
        }
    }
}

// 尝试构建对象
export function tryConstructObject(
    field: string,
    values: Recordable = {}
): Recordable | undefined {
    const pattern = /^\{(.+)\}$/
    if (pattern.test(field)) {
        const match = field.match(pattern)
        if (match && match[1]) {
            const keys = match[1].split(",")
            if (!keys.length) {
                return
            }

            const result = {}
            keys.forEach(k => {
                set(result, k.trim(), values[k.trim()])
            })

            return Object.values(result).filter(Boolean).length
                ? result
                : undefined
        }
    }
}

// 嵌套数据复原
export function nestFormDataRenew(
    keys: string[],
    value: any,
    obj: Recordable = {}
) {
    let firstKey = keys.splice(0, 1)[0] // 获取第一个键值对
    if (keys.length > 0) {
        obj[firstKey] = nestFormDataRenew(keys, value, {})
    } else {
        obj[firstKey] = value
    }
    return obj
}
