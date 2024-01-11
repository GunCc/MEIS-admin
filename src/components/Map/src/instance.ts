export type MapType = "BAIDU" | "GAODE" | "QQ"

const MapHash = new Map<MapType, string>()

MapHash.set("BAIDU", "BMapGL")
MapHash.set("GAODE", "AMap")
MapHash.set("QQ", "QMap")

// 地图事件
export interface MapActionType {
    // 初始化地图
    initMap: () => void

    // 获取地区中心点
    // getMapCenterInfo: () => any
}

class _Map {
    private map: any
    private mapDom: HTMLDivElement | null = null
    private mapType: string = ""
    constructor(mapDom: HTMLDivElement, mapType: MapType = "GAODE") {
        if (!mapDom) return
        this.mapDom = mapDom
        this.mapType = MapHash.get(mapType) as string
        this.map = (window as any)[this.mapType]
        console.log(this.map, this)
    }

    getMapDom() {
        return this.mapDom
    }

    getMap() {
        return this.map
    }

    init() {
        return new this.map.Map(this.getMapDom())
    }
}

export class GaodeMap extends _Map implements MapActionType {
    constructor(mapDom: HTMLDivElement) {
        super(mapDom)
    }

    // 初始化地图
    initMap() {
        this.init()
    }
}

export class BaiduMap extends _Map implements MapActionType {
    constructor(mapDom: HTMLDivElement) {
        super(mapDom, "BAIDU")
    }

    // 初始化地图
    initMap() {
        const instance = this.init()
        const baiduMap = this.getMap()
        var point = new baiduMap.Point(116.404, 39.915)
        instance.centerAndZoom(point, 15)
    }
}

export class QQMap extends _Map implements MapActionType {
    constructor(mapDom: HTMLDivElement) {
        super(mapDom, "QQ")
    }

    // 初始化地图
    initMap() {
        this.init()
    }
}
