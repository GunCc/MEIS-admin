export interface ProjectSetting {
    // 权限缓存类型
    permissionCacheType: CacheTypeEnum

    // 移动动画配置
    transitionSetting: TransitionSetting
}

export interface TransitionSetting {
    //  Whether to open the page switching animation
    enable: boolean
    // Route basic switching animation
    basicTransition: RouterTransitionEnum
    // Whether to open page switching loading
    openPageLoading: boolean
    // Whether to open the top progress bar
    openNProgress: boolean
}
