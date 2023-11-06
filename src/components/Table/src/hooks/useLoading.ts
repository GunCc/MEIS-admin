import { BasicTableProps } from "../types"

interface useLoadingContext {
    // getProps: ComputedRef<BasicTableProps>
}

export function useLoading() {
    const loadingRef = ref<boolean>(false)
    const getLoading = computed(() => {
        return unref(loadingRef)
    })

    function setLoading(bool: boolean) {
        loadingRef.value = bool
    }

    return {
        getLoading,
        setLoading,
    }
}
