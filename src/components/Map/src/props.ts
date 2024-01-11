import { propTypes } from "@/utils/propTypes"
import { MapType } from "./types"

export const basicProps = {
    // 地图类型
    mapType: {
        type: String as PropType<MapType>,
        default: "GAODE",
    },
    // 地图链接
    mapUrl: propTypes.string.def(""),
    // 宽度
    width: propTypes.string.def("auto"),
    // 高度
    height: propTypes.string.def("inherit"),
}
