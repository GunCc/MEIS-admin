import { tryOnUnmounted } from "@vueuse/core"
import { isFunction } from "lodash"

export function useTimeoutFn(handle: Fn, wait: number, native = false) {
    if (!isFunction(handle)) {
        throw new Error("第一个参数不是一个函数")
    }

    const { readyRef, stop, start } = useTimeoutRef(wait)
    if (native) {
        handle()
    } else {
        watch(
            readyRef,
            maturity => {
                maturity && handle()
            },
            { immediate: false }
        )
    }
    return { readyRef, stop, start }
}

// 等待时间
export function useTimeoutRef(wait: number) {
    const readyRef = ref<boolean>(false)
    let timer: TimeoutHandle
    function stop(): void {
        readyRef.value = false
        timer && window.clearTimeout(timer)
    }

    function start(): void {
        stop()
        timer = setTimeout(() => {
            readyRef.value = true
        }, wait)
    }

    start()

    tryOnUnmounted(stop)

    return { readyRef, stop, start }
}
