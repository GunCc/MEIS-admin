import {
    removeFileType,
    updateFileType,
    addFileType,
} from "@/api/v1/system/upload"
import { ResourceType } from "@/api/model/upload/request"
import { FormItemSchemas } from "@/components/Form/src/types/form"
import { nextTick } from "vue"
import { error } from "@/utils/log"


export function useModalType(
    setVisible: (flag?: boolean) => void,
    getVialdColumn: () => Recordable<any>[],
    setFormSchemas: (props: FormItemSchemas[]) => void,
    emit: EmitType
) {
    const modalType = ref<"edit" | "add">("edit")
    const rowRef = ref<Recordable>({})
    const schemasSetting = ref<FormItemSchemas[]>([])
    const basicModal = ref<Recordable>({})

    const getBasicModal = computed(() => {
        return unref(basicModal)
    })

    const getSchemasSetting = computed(() => {
        return unref(schemasSetting)
    })

    function setEditModalProps(props?: Recordable) {
        basicModal.value = {
            ...basicModal,
            ...props,
        }
    }

    function handleActionEdit(row) {
        modalType.value = "edit"
        rowRef.value = row
        setVisible()
        setEditModalProps({
            title: "编辑分类",
        })
        schemasSetting.value = getVialdColumn().map(item => {
            let key = item.prop
            return {
                label: item.label,
                field: item.prop,
                defaultValue: row[key],
            }
        })
        nextTick(() => {
            setFormSchemas(unref(schemasSetting))
        })
    }

    function handleAdd() {
        setVisible()
        modalType.value = "add"
        setEditModalProps({
            title: "添加分类",
        })

        schemasSetting.value = getVialdColumn().map(item => {
            return {
                label: item.label,
                field: item.prop,
                defaultValue: "",
            }
        })
        nextTick(() => {
            setFormSchemas(unref(schemasSetting))
        })
    }

    async function handleActionDelete(row) {
        try {
            await removeFileType({
                id: row.id,
            })
            emit("change")
        } catch (err) {
            error(err as string)
        }
    }

    async function handleFormSubmit(data: Recordable) {
        try {
            const getApi =
                unref(modalType) == "edit" ? updateFileType : addFileType
            let params = {
                ...data,
                [unref(modalType) == "edit" ? "id" : ""]:
                    unref(modalType) == "edit" ? unref(rowRef).id : "",
            } as ResourceType
            await getApi(params)
            setVisible(false)
            emit("change")
        } catch (err) {
           error(err as string)
        }
    }

    return {
        getBasicModal,
        getSchemasSetting,
        handleActionDelete,
        handleActionEdit,
        handleAdd,
        handleFormSubmit,
    }
}
