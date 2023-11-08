export interface Cache<V = any> {
    value?: V
    timeoutId?: ReturnType<typeof setTimeout>
    time?: number
    alive?: number
}

const NOT_ALIVE = 0

// T = key , V = value
export class Memory<T = any, V = any> {
    private cache: { [key in keyof T]?: Cache<V> } = {}
    private alive: number

    // 单位为秒
    constructor(alive = NOT_ALIVE) {
        this.alive = alive
    }

    // 获取整个缓存
    get getCache() {
        return this.cache
    }

    // 修改整个缓存
    setCache(cache) {
        this.cache = cache
    }

    get<K extends keyof T>(key: K) {
        return this.cache[key]
    }

    set<K extends keyof T>(key: K, value: V, expires?: number) {
        let item = this.get(key)
        // 如果没有时间 或者有效时间小于0
        if (!expires || (expires as number) <= 0) {
            expires = this.alive
        }

        // 如果有这参数了
        if (item) {
            if (item.timeoutId) {
                clearTimeout(item.timeoutId)
                item.timeoutId = undefined
            }
            item.value = value
        } else {
            item = { value, alive: expires }
            this.cache[key] = item
        }

        // 如果没有 expires 数据永久保存
        if (!expires) {
            return value
        }

        const now = new Date().getTime()

        item.time = expires > now ? expires : now + expires

        item.timeoutId = setTimeout(
            () => {
                this.remove(key)
            },
            expires > now ? expires - now : expires
        )

        return value
    }

    remove<K extends keyof T>(key: K) {
        const item = this.get(key)
        Reflect.deleteProperty(this.cache, key)
        if (item) {
            clearTimeout(item.timeoutId!)
            return item.value
        }
    }

    // 重置当前缓存器
    resetCache(cache: { [K in keyof T]: Cache }) {
        Object.keys(cache).forEach(key => {
            const k = key as any as keyof T
            const item = cache[k]
            if (item && item.time) {
                const now = new Date().getTime()
                const expire = item.time
                if (expire > now) {
                    this.set(k, item.value, expire)
                }
            }
        })
    }

    // 清除所有缓存
    clear() {
        Object.keys(this.cache).forEach(key => {
            const item = this.cache[key]
            item.timeoutId && clearTimeout(item.timeoutId)
        })
        this.cache = {}
    }
}
