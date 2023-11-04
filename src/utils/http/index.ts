// 创建axios实例
import { CustomAxios } from "./axios"
import { deepMerge } from "./../index"
import { AxiosTranstion, CreateAxiosConfig } from "./type"
import { clone, isEmpty, isNull, isString, isUndefined } from "lodash"
import { AxiosResponse } from "axios"
import { AxiosOtherConfig } from "./type"
import { ResultEnum } from "@/enums/resultEnum"
import { useMessage } from "./../../hooks/web/useMessage"
import { RequestEnum } from "@/enums/requestEnum"

// axios 拦截器数据 ---- 处理数据
const transform: AxiosTranstion = {
    beforeRequest(config, otherConfig) {
        const { baseURL } = otherConfig
        // 判断是否有地址
        if (baseURL && isString(baseURL)) {
            config.url = `${baseURL}${config.url}`
        }

        const params = config.params || {}
        const data = config.data || false
        if (config.method?.toUpperCase() === RequestEnum.GET) {
        } else {
            if (!isString(params)) {
                if (
                    Reflect.has(config, "data") &&
                    config.data &&
                    (Object.keys(config.data).length > 0 ||
                        config.data instanceof FormData)
                ) {
                    config.data = data
                    config.params = params
                } else {
                    // 非GET请求如果没有提供data，则将params视为data
                    config.data = params
                    config.params = undefined
                }
            } else {
                // 兼容restful风格
                config.url = config.url + params
                config.params = undefined
            }
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
            default:
                if (message) {
                    errorMsg = message
                }
        }
        createMessage.error(errorMsg)
        throw new Error(errorMsg || "api请求报错")
    },
}

function createAxios(opt?: Partial<CreateAxiosConfig>) {
    const { VITE_HTTP_URL } = import.meta.env
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
                    baseURL: VITE_HTTP_URL,
                    messageModal: "modal",
                },
                transform: clone(transform),
            } as CreateAxiosConfig,
            opt || {}
        )
    )
}

export const MEIS_http = createAxios()
