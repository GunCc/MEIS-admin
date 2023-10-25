import { BasicTableProps } from "./../types/index"
import { get, isBoolean, isFunction } from "lodash"
import { useTimeoutFn } from "@/hooks/core/useTimeout"
interface useDataSourceContext {
    getProps: ComputedRef<BasicTableProps>
    emit: EmitType
}

export function useDataSource({ getProps, emit }: useDataSourceContext) {
    const dataSourceRef = ref<Recordable[]>([])
    const rawDataSourceRef = ref<Recordable>({})

    const getDataSource = computed(() => {
        const dataSource = unref(dataSourceRef)
        if (!dataSource || dataSource.length === 0) {
            return unref(dataSourceRef)
        }
        return unref(dataSourceRef)
    })

    async function handleFetch() {
        const {
            api,
            beforeFetch,
            paginationSetting,
            fetchSetting,
            afterFetch,
        } = unref(getProps)
        if (!api && !isFunction(api)) {
            return api
        }
        try {
            let params = {}
            const { pageField, sizeField, listField, totalField } =
                Object.assign(
                    {
                        pageField: "page",
                        sizeField: "pagesize",
                        listField: "list",
                        totalField: "total",
                    },
                    fetchSetting
                )
            const { currentPage = 1, pageSize = 5 } =
                isBoolean(paginationSetting) || !paginationSetting
                    ? {}
                    : paginationSetting

            if (isBoolean(paginationSetting) && !paginationSetting) {
                params = {}
            } else {
                params[pageField] = currentPage
                params[sizeField] = pageSize
            }

            if (beforeFetch && isFunction(beforeFetch))
                params = beforeFetch(params)
            const res = await api(params)
            rawDataSourceRef.value = res

            const isArrayResult = Array.isArray(res)

            let resultItems: Recordable[] = isArrayResult
                ? res
                : get(res, listField)
            const resultTotal: number = isArrayResult
                ? res.length
                : get(res, totalField)

            if (afterFetch && isFunction(afterFetch)) {
                resultItems = (await afterFetch(resultItems)) || resultItems
            }

            dataSourceRef.value = resultItems

            emit("fetch-success", {
                items: unref(resultItems),
                total: resultTotal,
            })
            return resultItems
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
        getDataSource,
        handleFetch,
    }
}
