import { RouterTransitionEnum } from "@/enums/appEnum"
import { CacheTypeEnum } from "@/enums/cacheEnum"
import { ProjectSetting } from "@/types/config.d"
const setting: ProjectSetting = {
    permissionCacheType: CacheTypeEnum,
    formSetting: {
        nestDefaultByte: ".",
        nestFormatDefaultByte: "%",
    },
    transitionSetting: {
        //  Whether to open the page switching animation
        // The disabled state will also disable pageLoading
        enable: true,

        // Route basic switching animation
        basicTransition: RouterTransitionEnum.FADE_SIDE,

        // Whether to open page switching loading
        // Only open when enable=true
        openPageLoading: true,

        // Whether to open the top progress bar
        openNProgress: false,
    },
}

export default setting
