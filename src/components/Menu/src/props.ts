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
        default: () =>
            [
                {
                    title: "测试",
                    key: "1",
                    children: [
                        {
                            title: "测试11",
                            key: "11",
                        },
                        {
                            title: "测试12",
                            key: "12",
                        },
                    ],
                },
                {
                    title: "测试2",
                    key: "2",
                    children: [
                        {
                            title: "测试21",
                            key: "13",
                        },
                    ],
                },
                {
                    title: "测试3",
                    key: "3",
                },
            ] as MenuItem[],
    },
}
