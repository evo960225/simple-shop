import { defineNuxtPlugin } from "#app";
import { VueReCaptcha } from "vue-recaptcha-v3";

export default defineNuxtPlugin((nuxtApp)=> {
  const runtimeConfig = useRuntimeConfig()
  const { recaptchaSiteKey } = runtimeConfig.public
  nuxtApp.vueApp.use(VueReCaptcha, {
    siteKey: recaptchaSiteKey,
    loaderOptions: {
      autoHideBadge: true,
    },
  })
})
