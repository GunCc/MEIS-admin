import { getFileType } from "@/api/v1/system/upload"
import { ResourceType } from "@/api/model/upload/request"

export function useUploadType() {
    const uploadTypesList = ref<ResourceType[]>([])

    const getUploadFiles = computed(() => {
        return unref(uploadTypesList)
    })
    async function getDataResource() {
        try {
            const res = await getFileType()
            let list = res?.list || []
            list.unshift({
                name: "全部",
                id: "-1",
            })
            uploadTypesList.value = list
        } catch (error) {
            console.log(error)
        }
    }

    async function reload() {
        await getDataResource()
    }

    onMounted(() => {
        getDataResource()
    })

    return {
        reload,
        getUploadFiles,
    }
}
