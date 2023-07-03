<template>
  <div>
    <div class="flex justify-center w-full min-h-[calc(100vh-70px-94px-10px)]">

      <div class="m-auto mt-24 border !border-[#e6e0f1] shadow-[#e6e0f1] shadow-lg rounded-lg min-w-[350px] w-1/5 text-xl bg-[#fff]">
        <n-spin :show="isLoading">
          <div class="w-full">
            <div class="px-4 pt-4 pb-6" @keydown.enter="emailLogin">
              <h2 class="mt-4 mb-8 text-center text-3xl font-bold tracking-tight text-[#a8f]">
                後台登入
              </h2>

              <n-space justify="center" vertical>
                <div>
                  <n-input v-model:value="loginParams.email" type="email" placeholder="信箱" />
                </div>
                <div>
                  <n-input
                    type="password"
                    v-model:value="loginParams.password"
                    show-password-on="mousedown"
                    placeholder="密碼"
                  />
                </div>
                <div class="mb-3">
                  <n-checkbox v-model:checked="rememberMail">記住帳號</n-checkbox> 
                </div>
                <div class="flex justify-center">
                  <n-button color="#a8f" class="text-white w-full" @click="emailLogin">
                    登入
                  </n-button>
                </div>
                
                
              </n-space>
            </div>
          </div>
        </n-spin>
      </div>



      <n-modal
        v-model:show="showErrorModal"
        preset="dialog"
        title="登入錯誤">
        <template #header>
          <div class="font-black">登入錯誤</div>
        </template>
        <div class="px-8 font-bold text-md">{{ modalContent }}</div>
      </n-modal>

    </div>
  </div>
</template>

<script setup>
import { googleOneTap } from 'vue3-google-login'
import { NForm, NCard, NInput, NCheckbox, NButton, NSpace, useMessage, NSpin, NModal } from 'naive-ui';
import { googleAuthCodeLogin } from 'vue3-google-login'
import { VueReCaptcha, useReCaptcha } from 'vue-recaptcha-v3';
import { useManagerStore } from '@/stores/manager' 

let executeRecaptcha, recaptchaLoaded;
const managerStore = useManagerStore()
const showErrorModal = ref(false)
const modalContent = ref('')
const message = useMessage()
const runtimeConfig = useRuntimeConfig()
const { googleClientId: GOOGLE_CLIENT_ID, recaptchaSiteKey } = runtimeConfig.public
const captchaVerify = ref(false)

const isLoading = ref(false)
const loginParams = reactive({})
const rememberMail = ref()

onMounted(() => { 
  loginParams.email = localStorage.getItem('remember-backstage-mail')
  rememberMail.value = !!localStorage.getItem('remember-backstage-mail')
  
  const recaptchaObj = useReCaptcha()
  executeRecaptcha = recaptchaObj.executeRecaptcha
  recaptchaLoaded = recaptchaObj.recaptchaLoaded
})

// -- function


async function emailLogin() {

  const testEmail = useTestEmailFormat(loginParams.email)
  modalContent.value = ''
  if (!testEmail) {
    showErrorModal.value = true
    modalContent.value += ' • 信箱格式不正確'
  }
  const testPassword = useTestPasswordFormat(loginParams.password)
  if (!testPassword) {
    showErrorModal.value = true
    modalContent.value += ' • 密碼需要超過8個字，需包含數字、英文字'
  }
  if (showErrorModal.value) return

  // request
  isLoading.value = true
  const { data, error } = await useFetch('/api/backstage/auth/login', {
    method: 'POST',
    body: loginParams
  })

  
  if (!error.value) {
    const { data: userData } = await useFetch('/api/manager/profile', { key: 'manager' + Date.now().toString() })
    managerStore.setProfile(userData.value)
    message.success('登入成功！')
    await navigateTo('/backstage')
  } else {
    message.success('登入失敗！')
  }

  if (rememberMail.value) {
    localStorage.setItem('remember-backstage-mail', loginParams.email)
  }
  isLoading.value = false
}

// -- options
useHead({ title: '登入'})

definePageMeta({ 
  layout: 'none',
  middleware: 'is-logged-to-index-backstage'
})

</script>