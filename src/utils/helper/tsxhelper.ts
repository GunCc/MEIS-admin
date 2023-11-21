import { Slots } from "vue"
import { isFunction } from "lodash"
import { error } from "@/utils/log"

export function getSlot(slots: Slots, slot = "default", data?: any) {
    if (!slots || !Reflect.has(slots, slot)) {
        return null
    }

    if (!isFunction(slots[slot])) {
        error(`${slot}插槽有误`)
        return null
    }

    const slotFn = slots[slot]
    if (!slotFn) return null
    return slotFn(data)
}
