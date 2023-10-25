<script lang="tsx">
import { propTypes } from "@/utils/propTypes"
import { isFunction } from "lodash"
import { VNodeChild } from "vue"
import { getSlot } from "@/utils/helper/tsxhelper"
export default defineComponent({
    name: "BasicModal",
    props: {
        // 是否显示 modal
        visible: propTypes.bool.def(false),
        title: {
            type: [String, Object] as PropType<
                VNodeChild | JSX.Element | string
            >,
        },
        width: {
            type: [String, Number] as PropType<string | number>,
        },
        // 是否全屏
        fullscreen: propTypes.bool.def(false),
        // margin-top 值，默认为 15vh
        top: propTypes.string,
        // 是否需要遮罩
        modal: propTypes.bool.def(true),
        // 遮罩层的类选择器
        modalClass: propTypes.string,
        // 自身是否插入至 body 元素上，嵌套的必须指定该属性并赋值为 true
        appendToBody: propTypes.bool.def(false),
        // // 出现时将 body 滚动锁定
        lockScroll: propTypes.bool.def(true),
        // 开始时延
        openDelay: propTypes.number.def(0),
        // 关闭时延
        closeDelay: propTypes.number.def(0),
        // 是否可以通过点击遮罩关闭
        closeOnClickModal: propTypes.bool.def(true),
        // 是否可以通过点击 esc 关闭
        closeOnPressEscape: propTypes.bool.def(true),
        // 是否显示关闭按钮
        showClose: propTypes.bool.def(true),
        // // 关闭前的回调
        beforeClose: {
            type: Function as PropType<Fn>,
        },
        // 开启拖拽功能
        draggable: propTypes.bool.def(false),
        // 是否让header和footer剧中
        center: propTypes.bool.def(false),

        // 是否水平居中
        alignCenter: propTypes.bool.def(false),
        // 是否销毁modal中的所有元素
        destroyOnClose: propTypes.bool.def(false),
        // 自定义关闭图标，默认 Close
        closeIcon: {
            type: Object as PropType<string | Component>,
        },
        // 和原生的 CSS 的 z-index 相同，改变 z 轴的顺序
        zIndex: propTypes.number.def(0),
        //  header 的 aria-level 属
        headerAriaLevel: propTypes.string.def("2"),
    },
    emits: ["before-close", "update:visible"],
    setup(props, { emit, slots }) {
        const getModalBind = computed(() => {
            return {
                // ...attrs,
                ...props,
                beforeClose: handleBeforeClose,
            }
        })

        // 关闭前
        function handleBeforeClose() {
            const { beforeClose } = props
            if (beforeClose && isFunction(beforeClose)) beforeClose()
            emit("update:visible", false)
            emit("before-close")
        }

        // 获取内容
        const getContext = () => {
            const { visible } = props
            return (
                <>
                    <el-dialog
                        model-value={visible}
                        {...unref(getModalBind)}
                        v-slots={{
                            header: slots.header,
                            footer: slots.footer,
                        }}
                    >
                        {getSlot(slots)}
                    </el-dialog>
                </>
            )
        }

        return () => <>{getContext()}</>
    },
})
</script>
