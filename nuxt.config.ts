// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    app: {
        baseURL: '/svoyak/',
    },
    srcDir: 'src/',
    css: ['@/global/styles.less'],
    modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
    vite: {
        css: {
            preprocessorOptions: {
                less: {
                    additionalData: '@use "~/global/colors.less" as *;',
                },
            },
        },
    },
    i18n: {
        vueI18n: '@/plugins/i18n.config.ts',
    },
})
