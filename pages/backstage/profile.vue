<template>
  <div class="h-screen m-12"> 
    <div class="px-8 py-6 w-[400px] rounded-xl shadow shadow-sm border border-light-700">
      <h2 class="text-2xl font-bold mb-5 text-gray-700">使用者資料</h2>
      <div class="text-lg text-gray-700" @keydown.enter="updatePassword">
        <div>名字： {{ data.nickname }} </div>
        <div>信箱： {{ data.email }} </div>
        <div class="my-6"></div>
        <div class="w-full" >
          <div class="font-semibold">變更密碼</div>
          <n-input v-model:value="oldPassword" type="password" placeholder="舊密碼" show-password-on="click" :loading="isLoading"></n-input>
          <n-input v-model:value="newPassword" type="password" placeholder="新密碼" show-password-on="click" :loading="isLoading"></n-input>
          <n-button class="mt-1" color="#aa6" @click="updatePassword">確認</n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NForm, NCard, NInput, NInputNumber, NCheckbox, NButton, useMessage, NSpin, NModal, NDataTable, NIcon, NImage } from 'naive-ui';
const msg = useMessage()
const oldPassword = ref()
const newPassword = ref()
const isLoading = ref(false)
const { data, error } = await useFetch('/api/manager/profile', {
  method: 'GET'
})

async function updatePassword(event = null) {
  if (isLoading.value) return
  isLoading.value = true
  const { data: resultData, error } = await useFetch('/api/backstage/auth/update-password', {
    method: 'POST',
    body: {
      email: data.value.email,
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    }
  })
  if (error.value) {
    if (error.value.statusCode === 400) {
      msg.error('密碼錯誤!')
    } else {
      msg.error('更新失敗!')
    }
  } else {
    msg.success('更新成功!')
    oldPassword.value = ''
    newPassword.value = ''
  }
  isLoading.value = false
}


definePageMeta({ 
  layout: 'backstage',
  middleware: ''
})
</script>


<style>
main h1 {
  @apply text-lg text-dark-600 bg-blue-500;
}
</style>