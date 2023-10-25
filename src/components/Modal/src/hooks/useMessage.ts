import { messageType } from "element-plus"
import { isFunction } from "lodash"

interface MessageProp {
    title?: string
    type?: messageType
    context?: string
    successFn?: Fn
    cancelFn?: Fn
}
function useMessage({
    title = "标题",
    type = "info",
    context = "您确定执行此操作嘛？",
    successFn,
    cancelFn,
}: MessageProp) {
    ElMessageBox.confirm(context, title, {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type,
    })
        .then(async () => {
            successFn && isFunction(successFn) && (await successFn())
        })
        .catch(async () => {
            cancelFn && isFunction(cancelFn) && (await cancelFn())
        })
}

function useErrorMessage(info: Partial<MessageProp>) {
    useMessage({ ...info, type: "error" })
}
function useSuccessMessage(info: Partial<MessageProp>) {
    useMessage({ ...info, type: "success" })
}

function useWarnMessage(info: Partial<MessageProp>) {
    useMessage({ ...info, type: "warning" })
}

export { useMessage, useErrorMessage, useSuccessMessage, useWarnMessage }
