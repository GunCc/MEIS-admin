export function usePagination() {
    const getPaginationProps = computed(() => {
        return {
            layout: "->,prev, pager, next, jumper,  total",
        }
    })
    return {
        getPaginationProps,
    }
}
