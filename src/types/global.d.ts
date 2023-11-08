
// 深度可选
declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
}
