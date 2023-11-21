import { ResourceFile } from "@/api/model/upload/response"
import { getFileList } from "@/api/v1/system/upload"
import { PaginationSetting } from "@/components/Table/src/types"
import ManagerModalUpload from "../ModalUpload.vue"
import ManagerModalImageEdit from "../ModalImageEdit.vue"
import { error } from "@/utils/log"
import { get } from "lodash"

const { VITE_HTTP_URL } = import.meta.env
const PAGE_SIZE = 32

export function useMaterialList(
    handleOpen: (flag?: boolean) => void,
    getModalProps: Ref,
    setLoading: (flag?: boolean) => void,
    getTabsCurrent: WritableComputedRef<number | string>
) {
    const formValues = ref<Recordable>({})

    const imageList = ref<ResourceFile[]>([])

    const paginationConfRef = ref<Partial<PaginationSetting>>()

    const currentImageInfo = ref<Recordable>({})

    const getImageList = computed(() => {
        return unref(imageList).map(item => {
            item.url = `${VITE_HTTP_URL}/${item.url}`
            return item
        })
    })

    const getPaginationProps = computed(() => {
        return {
            currentPage: 1,
            pageSize: PAGE_SIZE,
            layout: "->,prev, pager, next, total",
            ...unref(paginationConfRef),
        } as PaginationSetting
    })
    const getImageColOptions = computed(() => {
        return {
            sm: 8,
            md: 6,
            lg: 4,
            xl: 3,
        }
    })

    // 修改分页数据
    function setPagination(info: Partial<PaginationSetting>) {
        paginationConfRef.value = {
            ...unref(getPaginationProps),
            ...info,
        }
    }

    // 添加图片
    function handleAddImage() {
        handleOpen()
        getModalProps.value = {
            title: "添加图片",
            component: shallowRef(ManagerModalUpload),
        }
    }

    // 确认上传
    function handleUploadSubmit() {
        handleOpen(false)
        handlePageChange()
    }

    // 表单页面发生变化后请求
    function handlePageChange(page: number = 1) {
        setPagination({
            currentPage: page,
        })
        getList()
    }

    function handleFormSubmit(values: Recordable) {
        formValues.value = values
        handlePageChange()
    }

    // 图片点击事件
    function handleEditImageName(row: Recordable) {
        currentImageInfo.value = row
        handleOpen()
        getModalProps.value = {
            title: "编辑图片",
            component: shallowRef(ManagerModalImageEdit),
        }
    }

    // 图片编辑
    function handleUpdateSubmit(row) {
        handleOpen(false)
        getList()
    }

    // 获取资源列表
    async function getList() {
        try {
            setLoading()
            const { currentPage = 1, pageSize = PAGE_SIZE } =
                unref(getPaginationProps)
            let params = {
                page: currentPage,
                pageSize,
                type_id: String(unref(getTabsCurrent)),
                ...unref(formValues),
            }
            const res = await getFileList(params)
            imageList.value = res.list

            const isArrayResult = Array.isArray(res)

            const resultTotal: number = isArrayResult
                ? res.length
                : get(res, "total")

            setPagination({
                total: resultTotal || 0,
            })
        } catch (err) {
            error(err as string)
        } finally {
            setLoading(false)
        }
    }

    watch(
        () => unref(getTabsCurrent),
        () => {
            handlePageChange()
        },
        {
            deep: true,
        }
    )

    onMounted(() => {
        getList()
    })

    return {
        currentImageInfo,
        getImageList,
        getPaginationProps,
        getImageColOptions,
        handlePageChange,
        handleUploadSubmit,
        handleAddImage,
        handleFormSubmit,
        handleEditImageName,
        handleUpdateSubmit,
    }
}
