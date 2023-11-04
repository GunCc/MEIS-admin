import ManagerModalType from "../ModalType.vue"
import { ResourceType } from "@/api/model/upload/request"
import { clone } from "lodash"

export function useCustomTabs(
    handleOpen: () => void,
    getModalProps: Ref,
    getUploadFiles: ComputedRef<ResourceType[]>
) {
    const tabs_current = ref<string | number>("-1")

    const getCurrent = computed({
        get: () => tabs_current.value,
        set: val => {
            tabs_current.value = val
        },
    })

    const getCustomOptions = computed(() => {
        const list = clone(unref(getUploadFiles) || []).map(item => {
            return {
                key: item.id,
                name: item.name,
            }
        })
        return {
            list,
        }
    })

    function handleTypeEdit() {
        // 打开窗口
        handleOpen()
        getModalProps.value = {
            title: "图片分类管理",
            component: shallowRef(ManagerModalType),
        }
    }

    return {
        handleTypeEdit,
        getCurrent,
        getCustomOptions,
    }
}
