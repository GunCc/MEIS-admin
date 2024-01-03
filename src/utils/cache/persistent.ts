import {
    APP_LOCAL_CACHE_KEY,
    APP_SESSION_CACHE_KEY,
    LOCK_INFO_KEY,
    TOKEN_KEY,
    MENUS_KEY,
    PROJ_CFG_KEY,
    MULTIPLE_TABS_KEY,
} from "@/enums/cacheEnum"
import { DEFAULT_CACHE_TIME } from "@/settings/encryptionSetting"
import { omit, pick } from "lodash"
import { Nullable } from "vitest"
import { createLocalStorage, createSessionStorage } from "."
import { Memory } from "./memory"
import { ProjectSetting } from "@/types/config.d"
import { AppRouteRecordRaw } from "@/router/types"
import { RouteLocationNormalized } from "vue-router"

interface BasicStore {
    [TOKEN_KEY]: string | number | null | undefined
    [MENUS_KEY]: AppRouteRecordRaw[]
    [PROJ_CFG_KEY]: ProjectSetting
    [MULTIPLE_TABS_KEY]: RouteLocationNormalized[]
}

type LocalStore = BasicStore
type SessionStore = BasicStore

export type BasicKeys = keyof BasicStore
type LocalKeys = keyof LocalStore
type SessionKeys = keyof SessionStore

const ls = createLocalStorage()
const ss = createSessionStorage()

const localMemory = new Memory(DEFAULT_CACHE_TIME)
const sessionMemory = new Memory(DEFAULT_CACHE_TIME)

// 初始化持久内存
function initPersistentMemory() {
    const localCache = ls.get(APP_LOCAL_CACHE_KEY)
    const sessionCache = ss.get(APP_SESSION_CACHE_KEY)
    localCache && localMemory.resetCache(localCache)
    sessionCache && sessionMemory.resetCache(sessionCache)
}

export class Persistent {
    static getLocal<T>(key: LocalKeys) {
        return localMemory.get(key)?.value as Nullable<T>
    }

    static setLocal(
        key: LocalKeys,
        value: LocalStore[LocalKeys],
        immediate = false
    ): void {
        localMemory.set(key, toRaw(value))
        immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache)
    }

    static removeLocal(key: LocalKeys, immediate = false): void {
        localMemory.remove(key)
        immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache)
    }

    static clearLocal(immediate = false): void {
        localMemory.clear()
        immediate && ls.clear()
    }

    static getSession<T>(key: SessionKeys) {
        return sessionMemory.get(key)?.value as Nullable<T>
    }

    static setSession(
        key: SessionKeys,
        value: SessionStore[SessionKeys],
        immediate = false
    ): void {
        sessionMemory.set(key, toRaw(value))
        immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache)
    }

    static removeSession(key: SessionKeys, immediate = false): void {
        sessionMemory.remove(key)
        immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache)
    }
    static clearSession(immediate = false): void {
        sessionMemory.clear()
        immediate && ss.clear()
    }

    static clearAll(immediate = false) {
        sessionMemory.clear()
        localMemory.clear()
        if (immediate) {
            ls.clear()
            ss.clear()
        }
    }
}

// 监听关闭事件
// window.addEventListener("beforeunload", () => {
//     ls.set(APP_LOCAL_CACHE_KEY, {
//         ...omit(localMemory.getCache, LOCK_INFO_KEY),
//         ...pick(ls.get(APP_LOCAL_CACHE_KEY), [
//             TOKEN_KEY,
//             USER_INFO_KEY,
//             LOCK_INFO_KEY,
//         ]),
//     })
//     ss.set(APP_SESSION_CACHE_KEY, {
//         ...omit(sessionMemory.getCache, LOCK_INFO_KEY),
//         ...pick(ss.get(APP_SESSION_CACHE_KEY), [
//             TOKEN_KEY,
//             USER_INFO_KEY,
//             LOCK_INFO_KEY,
//         ]),
//     })
// })

// storage改变事件
// function storageChange(e: any) {
//     const { key, newValue, oldValue } = e
//     if (!key) {
//         Persistent.clearAll()
//         return
//     }
//     if (!!newValue && !!oldValue) {
//         if (APP_LOCAL_CACHE_KEY === key) {
//             Persistent.clearLocal()
//         }
//         if (APP_SESSION_CACHE_KEY === key) {
//             Persistent.clearSession()
//         }
//     }
// }

// window.addEventListener("storage", storageChange)

initPersistentMemory()
