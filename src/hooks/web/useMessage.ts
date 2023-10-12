import { ElMessage } from "element-plus"

export function useMessage() {
    return {
        createMessage: ElMessage,
    }
}
