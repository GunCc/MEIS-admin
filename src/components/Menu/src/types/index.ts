export interface MenuItem {
    title: string
    key: string | number
    children?: MenuItem[]
}
