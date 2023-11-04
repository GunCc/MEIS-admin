import { Component, VNode } from "vue"
import FormSelect from "./src/component/FormSelect.vue"
import FormUpload from "./src/component/FormUpload.vue"
import { RenderCallbackParams } from "./src/types/form"
// import { ElInput } from "element-plus"

export type ComponentType = "Select" | "Input" | "Upload"

export interface CustomComponentProps {
    compAttr: Recordable
    props: Recordable
    compSlot:
        | ((renderCallbackParams: RenderCallbackParams) => any)
        | VNode
        | VNode[]
        | string
    field: string
}
export const componentMap = new Map<ComponentType, Component>()

componentMap.set("Input", ElInput)

componentMap.set("Select", FormSelect)

componentMap.set("Upload", FormUpload)
