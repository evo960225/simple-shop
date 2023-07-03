<template>
  <div class="flex justify-center w-full bg-light-300">

    <div class="rounded-md mt-16 px-9 py-5 max-w-[600px] bg-white shadow-md h-300px leading-relaxed">
      <div class="text-lg my-2 mb-5 font-semibold tracking-wide text-blue-400">
        需要驗證您的電子信箱
      </div>
      <p>感謝您註冊使用我們的服務！</p>
      <br>
      <p>為了確保您的帳戶安全，我們將會寄送驗證信到信箱：<span class="font-semibold text-rose-400">{{email}}</span></p  >
      <div class="flex">  
        <p>請點擊按鈕以完成信箱驗證：</p>
        <n-button size="tiny" @click="sendEmail" :loading="isLoading" :color="'#bb5'" class="w-26">
          {{ isSendEmail? '重送驗證信 ' : '寄送驗證信' }}
        </n-button>
      </div>
      <br>
      <p>
        若您沒有註冊本網站的帳戶，請忽略此郵件。若有任何疑問或需要協助，請隨時聯繫我們。
        謝謝您的使用與支持！
      </p>
    </div>
  </div>
</template>

<script setup>
import { NCard, NInput, NInputNumber, NCheckbox, NButton, useMessage } from 'naive-ui';
const { data: userProfile } = await useFetch('/api/user/profile', { method: 'GET', key: 'user-profile' + Date.now().toString() })
const email = computed(() => userProfile.value.email)
const msg = useMessage()
const isLoading = ref(false)
const isSendEmail = ref(false)

const checkIntervalTime = ref(5000)
let checkInterval = null
onMounted(() => {
  
})

onUnmounted ((x) => {
  clearInterval(checkInterval)
})


async function sendEmail() {
  isLoading.value = true
  
  await useFetch('/api/send-mail', { method: 'POST' })
  checkInterval = setInterval(checkEmailVerificationStatus, checkIntervalTime.value)

  isSendEmail.value = true
  isLoading.value = false
}

async function checkEmailVerificationStatus() {
  try {
    const { data: response } = await useFetch('/api/user/profile', { method: 'GET', key: 'user-profile' + Date.now().toString() })
    userProfile.value = response.value
    if (response.value.emailVerified) {
      clearInterval(checkInterval);
      navigateTo('/')
    }
  } catch (error) {
  }
}



</script>


<style>
main h1 {
  @apply text-lg text-dark-600 bg-blue-500;
}
</style>