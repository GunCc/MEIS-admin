import { nextTick } from "vue"
import {
    BasicFormProps,
    FormItemSchemas,
} from "@/components/Form/src/types/form"
import { calcSubtractSpace, getViewportOffset } from "@/utils/domUtils"
import { useWindowSize } from "@/hooks/event/useWindowSizeFn"
import { onMountedOrActivated } from "@/hooks/core/onMountedOrActivated"

export function useMaterialForm() {
    const getSchemas = computed((): FormItemSchemas[] => {
        return [
            {
                field: "keywords",
                label: "关键字",
                col: {
                    span: 6,
                },
                formItemProps: {
                    class: "mb-0",
                },
                componentProps: {
                    placeholder: "请输入关键字",
                },
            },
        ]
    })

    const getFormProps = computed((): BasicFormProps => {
        return {
            inline: true,
            schemas: unref(getSchemas),
            actionColOptions: {
                span: 18,
            },
        }
    })
    return {
        getFormProps,
    }
}

export function useMaterial(wrapperElRef: Ref, formElRef: Ref<ComponentRef>) {
    const wrapHeight = ref<string | number>(0)

    let paginationEl: HTMLElement | null
    let headerEl: HTMLElement | null

    const getWrapHeight = computed(() => {
        return `${unref(wrapHeight)}px`
    })

    async function calcMeterialListHeight() {
        await nextTick()

        const wrap = unref(wrapperElRef)
        if (!wrap) return

        if (!paginationEl) {
            paginationEl = wrap.querySelector(".meis-pagination") as HTMLElement
        }

        if (!headerEl) {
            headerEl = wrap.querySelector(".material-header") as HTMLElement
        }

        let formHeight = unref(formElRef)?.$el.offsetHeight || 0

        const { bottomIncludeBody } = getViewportOffset(wrap)
        const wrapSubtractSpace = calcSubtractSpace(wrap)
        let paginationHeight = paginationEl.offsetHeight || 0
        let headerHeight = headerEl.offsetHeight || 0

        let height =
            bottomIncludeBody -
            formHeight -
            wrapSubtractSpace -
            paginationHeight -
            headerHeight
        wrapHeight.value = height

        console.groupEnd()
    }

    useWindowSize(calcMeterialListHeight, 280)
    onMountedOrActivated(() => {
        calcMeterialListHeight()
    })

    return {
        getWrapHeight,
    }
}

export function useMaterialList() {
    const getImageColOptions = computed(() => {
        return {
            sm: 8,
            md: 6,
            lg: 4,
            xl: 3,
        }
    })
    return {
        getImageColOptions,
    }
}

export function useCustomTabs() {
    const tabs_current = ref<string | number>("-1")

    const getCurrent = computed({
        get: () => tabs_current.value,
        set: val => {
            tabs_current.value = val
        },
    })

    const getCustomOptions = computed(() => {
        return {
            list: [
                {
                    name: "全部",
                    key: "-1",
                },
                {
                    name: "用户图片",
                    key: "1",
                },
            ],
        }
    })

    return {
        getCurrent,
        getCustomOptions,
    }
}
