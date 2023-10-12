import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import WindiCSS from "vite-plugin-windicss"
import vueJsx from "@vitejs/plugin-vue-jsx"
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
            dts: "src/auto-imports.d.ts",
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/, // .vue
                /\.md$/, // .md
            ],
            vueTemplate: true,
            imports: [
                "vue",
                "vue-router",
                "vue/macros",
                // custom
                {
                    "@vueuse/core": [
                        // named imports
                        "useMouse", // import { useMouse } from '@vueuse/core',
                        // alias
                        ["useFetch", "useMyFetch"], // import { useFetch as useMyFetch } from '@vueuse/core',
                    ],
                    axios: [
                        // default imports
                        ["default", "axios"], // import { default as axios } from 'axios',
                    ],
                },
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
        // eslint(),
        vueJsx(),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@c": fileURLToPath(new URL("./src/components", import.meta.url)),
            "@a": fileURLToPath(new URL("./src/api", import.meta.url)),
        },
    },
})
