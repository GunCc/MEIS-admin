export interface MapActionType {
    // 初始化地图
    initMap: () => void
}

class Map {
    protected domNode: HTMLDivElement | null = null
    constructor(domNode: HTMLDivElement | null) {
        this.domNode = domNode
    }
    getDomNode() {
        return this.domNode
    }
}

export class GaodeMap extends Map {
    private map: any

    constructor(domNode: HTMLDivElement | null) {
        console.log("执行")
        super(domNode)
        this.map = (window as any).AMap
    }

    // 初始化地图
    private initMap() {
        if (!this.getDomNode()) return
        new this.map.Map(this.getDomNode())
    }

    getMapActionType(): MapActionType {
        let action: MapActionType = {
            initMap: this.initMap.bind(this),
        }
        return action
    }
}

export class BaiduMap extends Map {
    private map: any

    constructor(domNode: HTMLDivElement | null) {
        console.log("dome", domNode)
        super(domNode)
        this.map = (window as any).AMap
    }

    // 初始化地图
    private initMap() {
        if (!super.getDomNode()) return
        new this.map.Map(super.getDomNode())
    }

    getMapActionType(): MapActionType {
        return {
            initMap: this.initMap,
        }
    }
}

export class QQMap extends Map {
    private map: any

    constructor(domNode: HTMLDivElement | null) {
        super(domNode)
        this.map = (window as any).AMap
    }

    // 初始化地图
    private initMap() {
        if (!super.getDomNode()) return
        new this.map.Map(super.getDomNode())
    }

    getMapActionType(): MapActionType {
        return {
            initMap: this.initMap,
        }
    }
}
