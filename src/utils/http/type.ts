import type { AxiosRequestConfig, AxiosResponse } from "axios"
// 异常处理模式
export type ErrorMessageMode = "none" | "modal" | "message" | undefined
export type SuccessMessageMode = ErrorMessageMode

// 异常情况
export const NETWORK_ERROR = "ERR_NETWORK"
// 创建axios需要的配置
export interface CreateAxiosConfig extends AxiosRequestConfig {
    authenticationScheme?: string
    transform?: AxiosTranstion
    otherConfig?: AxiosOtherConfig
}

// axios生命周期函数
export interface AxiosTranstion {
    // 请求前
    beforeRequest?: (
        config: AxiosRequestConfig,
        otherConfig: AxiosOtherConfig
    ) => CreateAxiosConfig

    // 请求拦截器
    beforeRequestInterceptors?: (
        config: AxiosRequestConfig,
        otherConfig: AxiosOtherConfig
    ) => AxiosRequestConfig

    // 请求失败
    beforeRequestError?: (error: Error) => void
    // 请求失败处理
    afterRequestCatch?: (error: Error, otherConfig: AxiosOtherConfig) => void

    // 响应后处理数据拦截器
    afterResponse?: (
        res: AxiosResponse<Result>,
        otherConfig: AxiosOtherConfig
    ) => void

    // 响应拦截器
    afterResponseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>

    // 响应错误
    afterResponseError?: () => void
}

// axios项目定制配置
export interface AxiosOtherConfig {
    baseURL?: string
    messageModal?: SuccessMessageMode
    
}
