export interface ProjectSetting {
    // 权限缓存类型
    permissionCacheType: CacheTypeEnum

    // 移动动画配置
    transitionSetting: TransitionSetting

    // 表格配置
    formSetting: FormSetting
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

// 表格设置
export interface FormSetting {
    // 表格如果有嵌套默认取的字符
    nestDefaultByte: string
    // 表格如果有嵌套默认替换的字符
    nestFormatDefaultByte: string
}
