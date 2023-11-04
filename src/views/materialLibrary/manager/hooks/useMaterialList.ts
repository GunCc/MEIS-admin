import ManagerModalUpload from "../ModalUpload.vue"
export function useMaterialList(handleOpen: () => void, getModalProps: Ref) {
    const getImageColOptions = computed(() => {
        return {
            sm: 8,
            md: 6,
            lg: 4,
            xl: 3,
        }
    })

    // 添加图片
    function handleAddImage() {
        handleOpen()
        getModalProps.value = {
            title: "添加图片",
            component: shallowRef(ManagerModalUpload),
        }
    }

    return {
        handleAddImage,
        getImageColOptions,
    }
}
