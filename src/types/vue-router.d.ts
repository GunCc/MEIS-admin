// 覆盖全局 router 的 meta 属性
export {}

declare module "vue-router" {
    interface RouteMeta extends Record<string | number | symbol, unknown> {
        title: string
        icon?: string
        sort: number
    }
}
