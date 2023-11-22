export interface MenuItem {
    title: string
    key: string | number
    path: string
    children?: MenuItem[]
}
