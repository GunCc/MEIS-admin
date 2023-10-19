declare type Recordable<T = any> = Record<string, any>

declare type EmitType = (event: string, ...args: any[]) => void

declare interface Fn<T = any, R = T> {
    (...arg: T[]): R
}
