<template>
  <div class="w-full bg-light-300">
    <div class="flex mt-8 min-h-[calc(100vh-70px-94px-10px)] ">
      <n-card class="m-auto border !border-[#e6e0f1] shadow-[#e6e0f1] shadow-lg rounded-lg min-w-[350px] w-1/5  text-xl">
        <n-spin :show="isLoading">

          <div class="w-full">
          <div class="px-5 pt-3 pb-5" @keydown.enter="mailRegister">
            <h2 class="mt-4 mb-6 text-center text-3xl font-bold tracking-wide text-[#f78]">
              註冊
            </h2>

            <n-space justify="center" vertical>
              <div class="mb-0.5 space-y-2">
                <n-input v-model:value="registerParams.email" type="email" placeholder="信箱" />
                <n-input v-model:value="registerParams.nickname" type="text" :placeholder="$t('USER_NAME')" />
                <n-input
                  type="password"
                  v-model:value="registerParams.password"
                  show-password-on="mousedown"
                  placeholder="密碼"
                />
              </div>

              <div class=" mt-8 space-y-2">
                <n-button  color="#f78" class="text-white w-full tracking-widest" @click="mailRegister">
                  註冊
                </n-button>
                <n-button round
                class="group relative flex w-full justify-center rounded-md border border-gray-100 bg-white py-2 px-4 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                @click="googleRegister"
              >
                <LogoGoogle class="w-5 h-5 mr-2 text[16px] text-[#fbb] " />
                Google註冊 
              </n-button>
              </div>
             
            </n-space>
          </div>
        </div>



        </n-spin>
      </n-card>
    </div>

    <n-modal
      v-model:show="showErrorModal"
      preset="dialog"
      title="登入錯誤">
      <template #header>
        <div class="font-black">登入錯誤</div>
      </template>
      <p class="px-8 font-bold text-md whitespace-pre-wrap">{{ modalContent }}</p>
    </n-modal>
  </div>
</template>

<script setup>
import { googleOneTap } from 'vue3-google-login'
import { NCard, NInput, NCheckbox, NButton, useMessage, NSpin, NModal } from 'naive-ui';
import { googleAuthCodeLogin } from 'vue3-google-login'
import { LogoGoogle } from '@vicons/ionicons5'
import { useUserStore } from '~~/stores/user';
import { VueReCaptcha, useReCaptcha } from 'vue-recaptcha-v3';

const isLoading = ref(false)
const message = useMessage()
const runtimeConfig = useRuntimeConfig()
const { googleClientId: GOOGLE_CLIENT_ID } = runtimeConfig.public
const showErrorModal = ref(false)
const modalContent = ref('')
const registerParams = reactive({ email: null, nickname: null, password: null })
let executeRecaptcha, recaptchaLoaded;
onMounted(() => { 
  const recaptchaObj = useReCaptcha()
  executeRecaptcha = recaptchaObj.executeRecaptcha
  recaptchaLoaded = recaptchaObj.recaptchaLoaded
})

async function mailRegister() {
  
  // 防機器人
  await recaptchaLoaded()
  const recaptchaToken = await executeRecaptcha('login')


  modalContent.value = ''
  if (!registerParams.nickname) {
    showErrorModal.value = true
    modalContent.value += ' • 需要輸入使用者名稱\n'
  }
  const testEmail = useTestEmailFormat(registerParams.email)
  if (!testEmail) {
    showErrorModal.value = true
    modalContent.value += ' • 信箱格式不正確\n'
  }
  const testPassword = useTestPasswordFormat(registerParams.password)
  if (!testPassword) {
    showErrorModal.value = true
    modalContent.value += ' • 密碼需要超過8個字，需包含數字、英文字\n'
  }

  if(showErrorModal.value) return

  isLoading.value = true
  const { data, error } = await useFetch('/api/auth/email-register', {
    method: 'POST',
    body: {
      nickname: registerParams.nickname,
      email: registerParams.email,
      password: registerParams.password,
      recaptchaToken: recaptchaToken
    },
  })
  isLoading.value = false
  
  if (error.value) {
    if (error.value.status === 400) {
      message.success(`帳號已存在，無法註冊！`)
    } else {
      message.success(`帳號註冊失敗! ${ error.value?.data?.message }`)
    }
  } else {
    message.success("帳號註冊成功！")
    await useUserStore().refreshProfile()
    await navigateTo('/member/email-verify')
  }
}

async function googleRegister() {

  // 防機器人
  await recaptchaLoaded()
  const recaptchaToken = await executeRecaptcha('login')

  const code = await googleAuthCodeLogin({
    clientId: GOOGLE_CLIENT_ID
  }).then((response) => {
    return response?.code
  })
  if (!code) {
    message.error("Google驗證失敗！")
  }
  const { data, error } = await useFetch('/api/auth/google-register', {
    method: 'POST',
    body: {
      code,
      recaptchaToken
    }
  })
  
  if (!error.value) {
    message.success("帳號註冊成功！")
    await useUserStore().refreshProfile()
    navigateTo('/')
  } else {
    if (error.value.status === 400) {
      message.success(`帳號已存在，無法註冊！`)
    } else {
      message.success(`帳號註冊失敗! ${ error.value?.data?.message }`)
    }
  }
}

definePageMeta({ title: '註冊' })
</script>