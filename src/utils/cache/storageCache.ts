import { Nullable } from "vitest"
import { AesEncryption, EncryptionParmas } from "../cipher"
import { cacheCipher } from "@/settings/encryptionSetting"
import { isNullOrUnDef } from "../is"

export interface CreateStorageParams extends EncryptionParmas {
    prefixKey: string // 前缀
    storage: Storage // 缓存类型
    hasEncrypt: boolean // 是否加密
    timeout?: Nullable<number> // 倒计时
}

export const createStorage = ({
    prefixKey = "",
    storage = sessionStorage,
    key = cacheCipher.key,
    iv = cacheCipher.iv,
    hasEncrypt = true,
    timeout = null,
}: Partial<CreateStorageParams> = {}) => {
    if (hasEncrypt && [key.length, iv.length].some(item => item !== 16)) {
        throw new Error("当你需要加密时，key和iv都得为16位")
    }

    // 实例化加密对象
    const encryption = new AesEncryption({ key, iv })

    // 构建一个生成 session和local的缓存对象
    const WebStorage = class WebStorage {
        private storage: Storage // 缓存类型
        private prefixKey?: string // 缓存前缀
        private encryption: AesEncryption // 加密方法
        private hasEncrypt: boolean // 是否加密
        constructor() {
            this.storage = storage
            this.prefixKey = prefixKey
            this.encryption = encryption
            this.hasEncrypt = hasEncrypt
        }

        // 获取key值
        private getKey(key: string) {
            return `${this.prefixKey}${key}`.toUpperCase()
        }

        // 设置缓存数据
        set(key: string, value: any, expire: number | null = timeout) {
            const stringData = JSON.stringify({
                value,
                time: Date.now(),
                expire: !isNullOrUnDef(expire)
                    ? new Date().getTime() + expire * 1000
                    : null,
            })
            const stringifyValue = this.hasEncrypt
                ? this.encryption.encryptByAES(stringData)
                : stringData
            this.storage.setItem(this.getKey(key), stringifyValue)
        }
        // 获取缓存数据
        get(key: string, def: any = null): any {
            const val = this.storage.getItem(this.getKey(key))
            if (!val) return def
            try {
                const decVal = this.hasEncrypt
                    ? this.encryption.decryptByAES(val)
                    : val
                const data = JSON.parse(decVal)
                const { value, expire } = data
                if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
                    return value
                }
                this.remove(key)
            } catch (error) {
                // 解析数据如果报错返回默认值
                return def
            }
        }
        // 删除缓存数据
        remove(key) {
            this.storage.removeItem(this.getKey(key))
        }
        /**
         * Delete all caches of this instance
         */
        clear(): void {
            this.storage.clear()
        }
    }
    return new WebStorage()
}
