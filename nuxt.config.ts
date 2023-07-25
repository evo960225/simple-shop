
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    'nuxt-icon',
    'nuxt-windicss',
    '@pinia/nuxt',
  ],
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
            'naive-ui',
            'vueuc',
            '@css-render/vue3-ssr',
            '@juggle/resize-observer'
          ]
        : ['@juggle/resize-observer']
  },
  vite: {
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
          : []
    }, 
  },

  routeRules:{
    '/backstage/**': { ssr: false },
    '/member/**': { ssr: false },
    '/checkout/**': { ssr: false },
  },
  i18n: {
    defaultLocale: 'zh-tw',
    langDir: 'locales',
    locales: [
      { code: 'zh-tw', file: 'zh_TW.json', iso: 'zh-TW', name: '繁體中文' },
      { code: 'zh-cn', file: 'zh_CN.json', iso: 'zh-CN', name: '简体中文' },
      { code: 'en', file: 'en_US.json', iso: 'en-US', name: 'English' },
      { code: 'jp', file: 'ja_JP.json', iso: 'ja-JP', name: '日本語' },
      { code: 'kr', file: 'ko_KR.json', iso: 'ko-KR', name: '한국어' }
    ],
    strategy: 'no_prefix',
    vueI18n: {
      legacy: false,
    }
  },
  runtimeConfig: {
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    jwtSignSecret: process.env.JWT_SIGN_SECRET,
    jwtSignSecretbackstage: process.env.JWT_SIGN_SECRET_BACKSTAGE,
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    publicDir: process.env.NODE_ENV === 'production' ? '../public' : './public', 
    loginMaxAge: 60 * 60 * 24 * 7,
    paynowId: process.env.PAYNOW_ID,
    paynowPassword: process.env.PAYNOW_PASSWORD,
    public: {
      serviceName: process.env.SERVICE_NAME,
      buildTest: true,
      productImageUrl: '/images/product',
      gameHeaderImageUrl: '/images/game/_list',
      host: process.env.NODE_ENV === 'development'? 'https://127.0.0.1:3000' : 'https://simple-shop.hoshiko.live',
      storeImagePath: process.env.NODE_ENV === 'development' ? './public/images/store' : '../public/images/store',
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
      paynowUrl: process.env.NODE_ENV === 'development' ? 'https://test.paynow.com.tw/' : 'https://test.paynow.com.tw/',
      fbUrl: process.env.FB_URL,
    }
  },
  css: ['@/assets/styles/main.scss'],
  plugins: [{ src: '~/plugins/aos.ts', mode: 'client' },],
  app:{
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      script: [

      ],
      link: [
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'icon', sizes: '16x16 32x32 64x64', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/jpeg', sizes: '196x196', href: '/favicon/favicon-192.jpg' },
        { rel: 'icon', type: 'image/jpeg', sizes: '160x160', href: '/favicon/favicon-160.jpg' },
        { rel: 'icon', type: 'image/jpeg', sizes: '96x96', href: '/favicon/favicon-96.jpg' },
        { rel: 'icon', type: 'image/jpeg', sizes: '64x64', href: '/favicon/favicon-64.jpg' },
        { rel: 'icon', type: 'image/jpeg', sizes: '32x32', href: '/favicon/favicon-32.jpg' },
        { rel: 'icon', type: 'image/jpeg', sizes: '16x16', href: '/favicon/favicon-16.jpg' },
        { rel: 'apple-touch-icon', type: 'image/jpeg', href: '/favicon/favicon-57.jpg' },
        { rel: 'apple-touch-icon', type: 'image/jpeg', sizes: '114x114', href: '/favicon/favicon-114.jpg' },
        { rel: 'apple-touch-icon', type: 'image/jpeg', sizes: '72x72', href: '/favicon/favicon-72.jpg' },
        { rel: 'apple-touch-icon', type: 'image/jpeg', sizes: '144x144', href: '/favicon/favicon-144.jpg' },
        { rel: 'apple-touch-icon', type: 'image/jpeg', sizes: '60x60', href: '/favicon/favicon-60.jpg' },
        { rel: 'apple-touch-icon', type: 'image/jpeg', sizes: '120x120', href: '/favicon/favicon-120.jpg' },
        { rel: 'apple-touch-icon', type: 'image/jpeg', sizes: '76x76', href: '/favicon/favicon-76.jpg' },
        { rel: 'apple-touch-icon', type: 'image/jpeg', sizes: '152x152', href: '/favicon/favicon-152.jpg' },
        { rel: 'apple-touch-icon', type: 'image/jpeg', sizes: '180x180', href: '/favicon/favicon-180.jpg' },
      ]
    },
  },
  nitro: {
    compressPublicAssets: { gzip:false, brotli: true },
    publicAssets: [{
      maxAge: 60 * 60 * 24 * 7
    }]
  }
})
