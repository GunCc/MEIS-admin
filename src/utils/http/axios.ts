import { Result } from "@/types/axios"
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import { cloneDeep, isFunction } from "lodash"
import { AxiosCanceler } from "./cancel"
import { AxiosOtherConfig, CreateAxiosConfig } from "./type"

export class CustomAxios {
    private instance: AxiosInstance
    private readonly axiosConfig: CreateAxiosConfig

    // 实例
    constructor(axiosConfig: CreateAxiosConfig) {
        this.axiosConfig = axiosConfig
        this.instance = axios.create(axiosConfig)
        this.setupInterceptors()
    }

    // 拦截器配置
    setupInterceptors() {
        const transform = this.getTransform()
        if (!transform) return

        const {
            beforeRequestInterceptors,
            beforeRequestError,
            afterResponseInterceptors,
            afterResponseError,
        } = transform

        const axiosCanceler = new AxiosCanceler()

        // 请求拦截
        // @ts-ignore
        this.instance.interceptors.request.use((config: AxiosRequestConfig) => {
            axiosCanceler.addPending(config)
            if (
                beforeRequestInterceptors &&
                isFunction(beforeRequestInterceptors)
            ) {
                config = beforeRequestInterceptors(config, this.axiosConfig)
            }
            return config
        }, undefined)

        // 请求错误拦截器
        beforeRequestError &&
            isFunction(beforeRequestError) &&
            this.instance.interceptors.request.use(
                undefined,
                beforeRequestError
            )

        // 响应拦截器
        this.instance.interceptors.response.use((res: AxiosResponse<any>) => {
            res && axiosCanceler.removePending(res.config)

            if (
                afterResponseInterceptors &&
                isFunction(afterResponseInterceptors)
            ) {
                res = afterResponseInterceptors(res)
            }
            return res
        }, undefined)

        // 响应错误拦截器
        afterResponseError &&
            isFunction(afterResponseError) &&
            this.instance.interceptors.response.use(
                undefined,
                afterResponseError
            )
    }

    // 获取定制拦截器
    private getTransform() {
        const { transform } = this.axiosConfig
        return transform
    }

    // 封装的post
    post<T = any>(
        config: AxiosRequestConfig,
        options?: AxiosOtherConfig
    ): Promise<T> {
        return this.request({ ...config, method: "POST" }, options)
    }

    // 上传文件
    // uploadFile<T = any>() {}

    // 请求
    request<T = any>(
        config: AxiosRequestConfig,
        options?: AxiosOtherConfig
    ): Promise<T> {
        let conf = cloneDeep(config)
        const transform = this.getTransform()
        const { afterResponse, afterRequestCatch, beforeRequest } =
            transform || {}
        const { otherConfig } = this.axiosConfig

        const opt: AxiosOtherConfig = Object.assign({}, otherConfig, options)

        if (beforeRequest && isFunction(beforeRequest)) {
            conf = beforeRequest(conf, opt)
        }
        console.log(conf)
        return new Promise((resolve, reject) => {
            this.instance
                .request<any, AxiosResponse<Result>>(conf)
                .then((res: AxiosResponse<Result>) => {
                    if (afterResponse && isFunction(afterResponse)) {
                        try {
                            const ret = afterResponse(res, opt)
                            resolve(ret)
                        } catch (error) {
                            reject(error || new Error("request error!"))
                        }
                        return
                    }
                    resolve(res as unknown as Promise<T>)
                })
                .catch(e => {
                    if (afterRequestCatch && isFunction(afterRequestCatch)) {
                        reject(afterRequestCatch(e, opt))
                        return
                    }
                    if (axios.isAxiosError(e)) {
                        // rewrite error message from axios in here
                    }
                    reject(e)
                })
        })
    }
}
