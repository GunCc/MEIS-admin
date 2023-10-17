import { AxiosRequestConfig, Canceler } from "axios"
import { isFunction } from "lodash"

let pendingMap = new Map<string, Canceler>()

// 获取待定的url
export const getPendingUrl = (config: AxiosRequestConfig) =>
    [config.method, config.url].join("&")

// 控制axios请求 放重 节流防抖
export class AxiosCanceler {
    // 添加请求
    addPending(config: AxiosRequestConfig) {
        this.removePending(config)
        const url = getPendingUrl(config)
        config.cancelToken =
            config.cancelToken ||
            new axios.CancelToken(cancel => {
                if (!pendingMap.has(url)) pendingMap.set(url, cancel)
            })
    }

    // 删除请求
    removePending(config: AxiosRequestConfig) {
        const url = getPendingUrl(config)
        if (pendingMap.has(url)) {
            const cancel = pendingMap.get(url)
            cancel && cancel(url)
            pendingMap.delete(url)
        }
    }

    // 清除所有请求
    removeAllPending() {
        pendingMap.forEach(cancel => {
            cancel && isFunction(cancel) && cancel()
        })
        pendingMap.clear()
    }

    // 重置
    reset() {
        pendingMap = new Map<string, Canceler>()
    }
}
