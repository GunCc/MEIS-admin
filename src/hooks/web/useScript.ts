import { onMounted, onUnmounted, ref } from "vue"

interface ScriptOptions {
    src: string
    defer?: boolean
    async?: boolean
}

export interface useScriptContext<T = any> {
    isLoading: Ref<boolean>
    error: Ref<boolean>
    success: Ref<boolean>
    toPromise: () => Promise<T>
}

export function useScript(opts: ScriptOptions): useScriptContext {
    const isLoading = ref(false)
    const error = ref(false)
    const success = ref(false)
    let script: HTMLScriptElement

    const promise = new Promise((resolve, reject) => {
        onMounted(() => {
            script = document.createElement("script")
            script.type = "text/javascript"
            script.onload = function () {
                isLoading.value = false
                success.value = true
                error.value = false
                resolve("")
            }

            script.onerror = function (err) {
                isLoading.value = false
                success.value = false
                error.value = true
                reject(err)
            }

            const { src, defer = false, async = false } = opts
            script.src = src
            script.defer = defer
            script.async = async

            document.head.appendChild(script)
        })
    })

    onUnmounted(() => {
        script && script.remove()
    })

    return {
        isLoading,
        error,
        success,
        toPromise: () => promise,
    }
}
