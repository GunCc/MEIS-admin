import { isDevMode } from "@/utils/env";

// 加密设置

// 默认所有缓存的时间
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7 * 1000

// aes 加密密钥
export const cacheCipher = {
    key: "1234567891023456",
    iv: "123456789102345_",
}

export const enableStorageEncryption = !isDevMode();
