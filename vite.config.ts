import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import WindiCSS from "vite-plugin-windicss"
import eslint from "vite-plugin-eslint"
export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/design/elementPlus/theme.scss" as *;`,
            },
        },
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [
                ElementPlusResolver({
                    importStyle: "sass",
                }),
            ],
        }),
        Components({
            resolvers: [
                ElementPlusResolver({
                    importStyle: "sass",
                }),
            ],
        }),
        WindiCSS(),
        eslint(),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@c": fileURLToPath(new URL("./src/components", import.meta.url)),
        },
    },
})
