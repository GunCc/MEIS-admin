import { ElMessageBoxOptions } from "element-plus"
import { isFunction } from "lodash"

type ConfirmProps = ElMessageBoxOptions & {
    success?: Fn
    fail?: Fn
}

function createConfirm(options: ConfirmProps) {
    ElMessageBox(options)
        .then(() => {
            isFunction(options.success) && options.success()
        })
        .catch(() => {
            isFunction(options.fail) && options.fail()
        })
}

export function useMessage() {
    return {
        createMessage: ElMessage,
        createConfirm: createConfirm,
    }
}
