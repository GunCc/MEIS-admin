export type MapType = "BAIDU" | "GAODE"
export const basicProps = {
    mapType: {
        type: String as PropType<MapType>,
        default: "GAODE",
    },
}
