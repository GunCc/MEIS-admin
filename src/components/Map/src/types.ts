import { useScript, useScriptContext } from "@/hooks/web/useScript"
import { BaiduMap, GaodeMap, MapActionType, MapType, QQMap } from "./instance"

type GaodeMapType = typeof GaodeMap
// type GaodeMapType = typeof GaodeMap
// type GaodeMapType = typeof GaodeMap

const Map_map = new Map<MapType, GaodeMapType>()

Map_map.set("GAODE", GaodeMap)
Map_map.set("BAIDU", BaiduMap)
Map_map.set("QQ", QQMap)

export class AppMap {
    private src: string
    private type: MapType
    private script: useScriptContext
    private instance: MapActionType | null = null

    constructor(src: string, type: MapType) {
        this.src = src
        this.type = type
        this.script = useScript({ src: this.src })
    }

    init(domNode: HTMLDivElement | null) {
        if (!domNode || this.instance) return null
        let _map = Map_map.get(this.getType())
        if (!_map) return null
        let mapAction = new _map(domNode)
        mapAction.initMap()
    }

    getScript() {
        return this.script
    }

    getType(): MapType {
        return this.type
    }

    getInstance(): MapActionType | null {
        return this.instance
    }
}
