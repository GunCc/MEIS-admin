import { isNull, isUndefined } from "lodash"

// 如果是null或者undefined
export function isNullOrUnDef(val: unknown): val is null | undefined {
    return isUndefined(val) || isNull(val)
}
