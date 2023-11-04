export interface SelectProps {
    // 是否多选
    multiple: boolean
    // 是否禁用
    disabled: boolean
    // 作为 value 唯一标识的键名，绑定值为对象类型时必填
    valueKey: string
    // 输入框尺寸
    size: "" | "large" | "default" | "small"
    // 多选时是否将选中值按文字的形式展示
    collapseTags: boolean
    // 是否可以清空选项
    clearable: boolean
    // 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 要使用此属性，collapse-tags属性必须设定为 true
    collapseTagsTooltip: boolean
    // multiple 属性设置为 true 时，代表多选场景下用户最多可以选择的项目数， 为 0 则不限制
    multipleLimit: number
    // name Select 输入框的原生 name 属性
    name: string
    // tooltip 主题，内置了 dark / light 两种
    effect: "dark" | "light" | string
    // Select 输入框的原生 autocomplete 属性
    autocomplete: string
    
}
