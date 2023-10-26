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

    const getWrapHeight = computed(() => {
        console.log("12312312321", unref(wrapHeight))
        return `${unref(wrapHeight)}px`
    })

    async function calcMeterialListHeight() {
        await nextTick()

        const wrap = unref(wrapperElRef)
        if (!wrap) return

        if (!paginationEl) {
            paginationEl = wrap.querySelector(".meis-pagination") as HTMLElement
        }

        let formHeight = unref(formElRef)?.$el.offsetHeight || 0

        const { bottomIncludeBody } = getViewportOffset(wrap)
        const wrapSubtractSpace = calcSubtractSpace(wrap)
        let paginationHeight = paginationEl.offsetHeight || 0

        let height =
            bottomIncludeBody -
            formHeight -
            wrapSubtractSpace -
            paginationHeight
        wrapHeight.value = height

        console.group("素材库")
        console.log("formHeight", formHeight)
        console.log("bottomIncludeBody", bottomIncludeBody)
        console.log("wrapSubtractSpace", wrapSubtractSpace)
        console.log("paginationHeight", paginationHeight)
        console.log("height", height)
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
