import {
    tryOnMounted,
    tryOnUnmounted,
    useDebounce,
    useDebounceFn,
} from "@vueuse/shared"

interface WindowSizeOptions {
    once?: boolean
    immediate?: boolean
    listenerOptions?: AddEventListenerOptions | boolean
}

// 计算浏览器大小
export function useWindowSize<T>(
    fn: Fn<T>,
    wait = 150,
    options?: WindowSizeOptions
) {
    let handler = () => {
        fn()
    }

    // 防抖函数
    const handleSize = useDebounceFn(handler, wait)

    handler = handleSize

    // 开始
    const start = () => {
        if (options && options.immediate) {
            handler()
        }
        window.addEventListener("resize", handler)
    }

    const stop = () => {
        window.removeEventListener("resize", handler)
    }

    //
    tryOnMounted(() => {
        start()
    })

    tryOnUnmounted(() => {
        stop()
    })

    return [start, stop]
}
