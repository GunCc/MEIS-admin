import { BasicTableProps } from "./../types/index"
import { isFunction } from "lodash"
import { useTimeoutFn } from "@/hooks/core/useTimeout"
interface useDataSourceContext {
    getProps: ComputedRef<BasicTableProps>
}

export function useDataSource({ getProps }: useDataSourceContext) {
    async function handleFetch() {
        const { api, beforeFetch } = unref(getProps)
        if (!api && !isFunction(api)) {
            return api
        }
        let params = {}
        try {
            beforeFetch && isFunction(beforeFetch) && beforeFetch(params)
            const res = await api(params)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    onMounted(() => {
        useTimeoutFn(() => {
            unref(getProps).immediate && handleFetch()
        }, 16)
    })

    return {
        handleFetch,
    }
}
