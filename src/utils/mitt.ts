// Map可操作类型
export type EventType = string | symbol

// 事件传递的函数可选，并且可以不返回
export type Handler<T = any> = (event?: T) => void
export type WildcardHandler = (type: EventType, event?: any) => void

// 一个类型的所有当前注册的事件处理程序的数组
export type EventHandlerList = Array<Handler>
export type WildCardEventHandlerList = Array<WildcardHandler>

// A map of event types and their corresponding event handlers.
// 一个事件类型的map和他们的相应操作
export type EventHandlerMap = Map<
    EventType,
    EventHandlerList | WildCardEventHandlerList
>

export interface Emitter {
    all: EventHandlerMap
    on<T = any>(type: EventType, handler: Handler<T>): void
    on(type: "*", handler: WildcardHandler): void

    off<T = any>(type: EventType, handler: Handler<T>): void
    off(type: "*", handler: WildcardHandler): void

    emit<T = any>(type: EventType, event?: T): void
    emit(type: "*", event?: any): void
    clear(): void
}

export default function mitt(all?: EventHandleMap): Emitter {
    all = all || new Map()

    return {
        // 将事件名称注册到已处理程序中
        all,

        // 为给定类型注册事件处理程序
        on<T = any>(type: EventType, handler: Handler<T>) {
            const handlers = all?.get(type)
            const added = handlers && handlers.push(handler)
            if (!added) {
                all?.set(type, [handler])
            }
        },

        // 删除已注册程序
        off<T = any>(type: EventType, handler: Handler<T>) {
            const handlers = all?.get(type)
            if (handlers) handlers.splice(handlers.indexOf(handler) >>> 0.1)
        },

        // 触发器
        emit<T = any>(type: EventType, evt: T) {
            ;((all?.get(type) || []) as EventHandlerList)
                .slice()
                .map(handler => {
                    handler(evt)
                })

            ;((all?.get("*") || []) as EventHandlerList)
                .slice()
                .map(handler => {
                    handler(type, evt)
                })
        },

        clear() {
            this.all.clear()
        },
    }
}
