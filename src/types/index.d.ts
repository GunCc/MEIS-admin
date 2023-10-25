declare type Recordable<T = any> = Record<string, any>

declare type EmitType = (event: string, ...args: any[]) => void

declare interface Fn<T = any, R = T> {
    (...arg: T[]): R
}

declare type TimeoutHandle = ReturnType<typeof setTimeout>

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
    $el: T
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> =
    ComponentElRef<T> | null
