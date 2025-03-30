// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    app: {
        baseURL: '/svoyak/',
        pageTransition: { name: 'page', mode: 'out-in' },
    },
    srcDir: 'src/',
    css: ['@/global/styles.less'],
    modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
    vite: {
        css: {
            preprocessorOptions: {
                less: {
                    additionalData:
                        '@import "@/global/colors.less"; @import "@/global/mixins.less";',
                },
            },
        },
    },
    i18n: {
        vueI18n: '@/plugins/i18n.config.ts',
    },
    runtimeConfig: {
        public: {
            apiKey: '',
            authDomain: '',
            projectId: '',
            storageBucket: '',
            messagingSenderId: '',
            appId: '',
        },
    },
})
