// 创建axios实例
import { CustomAxios } from "./axios"
import { deepMerge } from "./../index"
import { AxiosTranstion, CreateAxiosConfig } from "./type"
import { clone, isEmpty, isNull, isString, isUndefined } from "lodash"
import { AxiosResponse } from "axios"
import { AxiosOtherConfig } from "./type"
import { Result } from "./../../types/axios.d"
import { ResultEnum } from "@/enums/resultEnum"
import { useMessage } from "./../../hooks/web/useMessage"

// axios 拦截器数据 ---- 处理数据
const transform: AxiosTranstion = {
    beforeRequest(config, otherConfig) {
        const { baseURL } = otherConfig
        // 判断是否有地址
        if (baseURL && isString(baseURL)) {
            config.url = `${baseURL}${config.url}`
        }
        return config
    },
    afterResponse(res: AxiosResponse<Result>, otherConfig: AxiosOtherConfig) {
        const { messageModal } = otherConfig
        const { data } = res
        if (!data) {
            return data
        }
        const { message, data: value, code } = data
        // 请求是否成功
        const hasSuccess =
            data && Reflect.has(data, "code") && code === ResultEnum.SUCCESS

        const { createMessage } = useMessage()
        if (hasSuccess) {
            let successMsg = message

            if (
                isNull(successMsg) ||
                isUndefined(successMsg) ||
                isEmpty(successMsg)
            ) {
                successMsg = "操作成功"
            }

            createMessage.success(successMsg)
            return value
        }

        // 根据不同的code进行修改
        let errorMsg = ""
        switch (code) {
            case ResultEnum.CLITENTERROR:
                errorMsg = "客户端出错"
                break
            default:
                if (message) {
                    errorMsg = message
                }
        }

        throw new Error(errorMsg || "api请求报错")
    },
}

function createAxios(opt?: Partial<CreateAxiosConfig>) {
    return new CustomAxios(
        deepMerge(
            {
                baseURL: "",
                authenticationScheme: "",
                // 超时时间
                timeout: 10 * 1000,
                // 请求格式
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                },
                otherConfig: {
                    baseURL: "http://127.0.0.1:8888",
                    messageModal: "modal",
                },
                transform: clone(transform),
            } as CreateAxiosConfig,
            opt || {}
        )
    )
}

export const MEIS_http = createAxios()
