import { Component } from "vue"

export type componentType = "Input"

export const componentMap = new Map<componentType, Component>()

componentMap.set("Input", () => render("el-input"))


function render(component) {
    return h(
        component
    )
}