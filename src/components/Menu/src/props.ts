import { PropType } from "vue"
import { MenuItem } from "./types"

export const basicProps = {
    mode: {
        type: String as PropType<"horizontal" | "vertical">,
        default: "vertical",
    },
    collapse: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
    ellipsis: {
        type: Boolean as PropType<boolean>,
        default: true,
    },
    uniqueOpened: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
    router: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
    items: {
        type: Array as PropType<MenuItem[]>,
        default: () => [] as MenuItem[],
    },
}
