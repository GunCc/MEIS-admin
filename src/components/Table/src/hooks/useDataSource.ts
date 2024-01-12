import {
    BasicTableProps,
    FetchParams,
    PaginationSetting,
} from "./../types/index"
import { get, isBoolean, isFunction, merge } from "lodash"
import { useTimeoutFn } from "@/hooks/core/useTimeout"
import { PAGE_SIZE } from "../const"
import { error } from "@/utils/log"

interface useDataSourceContext {
    getProps: ComputedRef<BasicTableProps>
    emit: EmitType
    setPagination: (info: Partial<PaginationSetting>) => void
    getPaginationProps: ComputedRef<PaginationSetting>
    getFormValues: () => Recordable
    setLoading: (bool: boolean) => void
}

export function useDataSource({
    getProps,
    emit,
    setPagination,
    getPaginationProps,
    getFormValues,
    setLoading,
}: useDataSourceContext) {
    const dataSourceRef = ref<Recordable[]>([])
    const rawDataSourceRef = ref<Recordable>({})

    const getDataSource = computed(() => {
        const dataSource = unref(dataSourceRef)
        if (!dataSource || dataSource.length === 0) {
            return unref(dataSourceRef)
        }
        return unref(dataSourceRef) as Recordable[]
    })

    // 获取表格内容
    function getTableDataSource() {
        return unref(dataSourceRef)
    }

    // 获取表格原始内容
    function getTableRawDataSource() {
        return unref(rawDataSourceRef)
    }

    // 表格页面发生变化
    async function handlePageChange(page) {
        setPagination({
            currentPage: page,
        })
        await handleFetch()
    }

    async function handleFetch(opt?: FetchParams) {
        const {
            api,
            beforeFetch,
            fetchSetting,
            afterFetch,
            showPagination,
            showSearchForm,
        } = unref(getProps)
        if (!api && !isFunction(api)) {
            return api
        }
        try {
            setLoading(true)
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
            const { currentPage = 1, pageSize = PAGE_SIZE } =
                unref(getPaginationProps)

            if (isBoolean(showPagination) && !showPagination) {
                params = {}
            } else {
                params[pageField] = (opt && opt.page) || currentPage
                params[sizeField] = pageSize
            }

            let fetchParams: Recordable = merge(
                params,
                showSearchForm ? getFormValues() : {},
                opt?.searchInfo ?? {}
            )

            if (beforeFetch && isFunction(beforeFetch))
                fetchParams = beforeFetch(fetchParams)
            const res = await api(fetchParams)
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

            setPagination({
                total: resultTotal || 0,
            })

            dataSourceRef.value = resultItems

            emit("fetch-success", {
                items: unref(resultItems),
                total: resultTotal,
            })
            return resultItems
        } catch (err) {
            error(err as string)
        } finally {
            setLoading(false)
        }
    }

    async function reload(opt?: FetchParams) {
        return await handleFetch(opt)
    }

    watch(
        () => unref(getProps).dataSource,
        () => {
            const { dataSource, api } = unref(getProps)
            !api && dataSource && (dataSourceRef.value = dataSource)
        },
        {
            immediate: true,
        }
    )

    onMounted(() => {
        useTimeoutFn(() => {
            unref(getProps).immediate && handleFetch()
        }, 16)
    })

    return {
        reload,
        handlePageChange,
        getDataSource,
        getTableDataSource,
        getTableRawDataSource,
        handleFetch,
    }
}
