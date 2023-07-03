<template>
  <div class="flex justify-center w-full min-h-[calc(100vh-70px-94px-10px)] bg-light-100">
    <n-card hoverable 

      class="m-auto !border-1.5 !border-[#d0d0e6] shadow-[#eef] shadow-lg rounded-xl min-w-[300px] w-[400px]  text-xl" >
      <n-spin :show="isLoading">
        <div class="w-full">
          <div class="px-5 pt-3 pb-5" @keydown.enter="emailLogin">
            <h2 class="mt-6 mb-8 text-center text-3xl font-bold tracking-wide text-[#f78]">
              登入帳號
            </h2>

            <n-space justify="center" vertical>
              <div class="mb-0.5">
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
              <div class="flex space-x-2 justify-center mt-1">
                <div class="flex justify-center ">
                  <n-button round color="#f78" class="text-white w-32 h-9 tracking-widest" @click="emailLogin">
                    登入
                  </n-button>
                </div>
                <div class="flex justify-center">
                  <n-button  round  color="#60A5FA"
                    class="group relative flex justify-center w-32 h-9 text-center
                             py-2  
                         hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    @click="handleGoogleLogin"
                  >
                    <LogoGoogle class="w-5 h-5 mr-2 text[16px] text-[#fff] " />
                    <span class="text-white">Google</span>
                  </n-button>
                </div>
              </div>
              <div class="text-center mt-1">
                <NuxtLink to="/register">
                  <NButton text class="text-red-400">註冊帳號</NButton>
                </NuxtLink>
              </div>
            </n-space>
          </div>
        </div>
      </n-spin>
    </n-card>


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
</template>

<script setup>
import { googleOneTap } from 'vue3-google-login'
import { NForm, NCard, NInput, NCheckbox, NButton, NSpace, useMessage, NSpin, NModal } from 'naive-ui';
import { googleAuthCodeLogin } from 'vue3-google-login'
import { VueReCaptcha, useReCaptcha } from 'vue-recaptcha-v3';
import { LogoGoogle } from '@vicons/ionicons5'
import { useUserStore } from '@/stores/user' 
const route = useRoute()

let executeRecaptcha, recaptchaLoaded;
const userStore = useUserStore()
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
  console.log(route.query);
  if (route.query?.member === '0') {
    message.info('需要登入帳號進行操作！')
  }
  loginParams.email = localStorage.getItem('remember-mail')
  rememberMail.value = !!localStorage.getItem('remember-mail')
  
  const recaptchaObj = useReCaptcha()
  executeRecaptcha = recaptchaObj.executeRecaptcha
  recaptchaLoaded = recaptchaObj.recaptchaLoaded
})

// -- function

async function handleGoogleLogin() {
  isLoading.value = true
  await recaptchaLoaded()
  const recaptchaToken = await executeRecaptcha('login')
  const code = await googleAuthCodeLogin({
    clientId: GOOGLE_CLIENT_ID
  }).then((response) => {
    return response?.code
  })

  if (!code) {
    message.error('登入失敗！');
  }

  const { data, error } = await useFetch('/api/auth/google-login', {
    method: 'POST',
    body: { code, recaptchaToken }
  }).catch()

  if (!error.value) {
    const { data: userData } = await useFetch('/api/user/profile', { key: 'user' + Date.now().toString() })
    userStore.setProfile(userData.value)
    message.success('登入成功！')
    await navigateTo('/')
  } else {
    if (error.value.status === 400) {
      message.error('登入失敗，您的帳號未註冊！')
    } else {
      message.error('登入失敗！')
    }
  }

  isLoading.value = false
}

async function emailLogin() {
  await recaptchaLoaded()
  const recaptchaToken = await executeRecaptcha('login')
  const testEmail = useTestEmailFormat(loginParams.email)
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
  const { data, error } = await useFetch('/api/auth/email-login', {
    method: 'POST',
    body: { ...loginParams, recaptchaToken }
  })
  isLoading.value = false

  
  if (!error.value) {
    const { data: userData } = await useFetch('/api/user/profile', { key: 'user' + Date.now().toString() })
    userStore.setProfile(userData.value)
    message.success('登入成功！')
    await navigateTo('/')
  } else {
    message.success('登入失敗！')
  }

  if (rememberMail.value) {
    localStorage.setItem('remember-mail', loginParams.email)
  }
  isLoading.value = false
}

// -- options
useHead({ title: '登入'})
definePageMeta({ 
  middleware: 'is-logged-to-index'
})

</script>