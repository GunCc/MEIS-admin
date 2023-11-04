import { Component, VNode } from "vue"
import FormSelectVue from "./src/component/FormSelect.vue"
import { RenderCallbackParams } from "./src/types/form"
// import { ElInput } from "element-plus"

export type ComponentType = "Select" | "Input"

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

componentMap.set("Select", FormSelectVue)
