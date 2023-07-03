<template>
  <div class="flex justify-center w-full min-h-[calc(100vh-70px-94px-10px)]">
    <div class="mt-12">
      <h2 class="text-lg font-semibold mb-2">遊戲銷量</h2>
      <div v-for="x in gameSales">
        <div class="flex">
          <div class="w-64">{{ x.gameName }}</div>
          <div>{{ x._count.gameId }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { googleOneTap } from 'vue3-google-login'
import { NForm, NCard, NInput, NCheckbox, NButton, NSpace, useMessage, NSpin, NModal, NUpload, NUploadDragger } from 'naive-ui';
import { googleAuthCodeLogin } from 'vue3-google-login'
import { VueReCaptcha, useReCaptcha } from 'vue-recaptcha-v3';
import { useUserStore } from '@/stores/user' 

const { data: gameSales } = await useFetch('/api/game/sales')


const userStore = useUserStore()
const showErrorModal = ref(false)
const modalContent = ref('')
const message = useMessage()
const runtimeConfig = useRuntimeConfig()


const isLoading = ref(false)
const loginParams = reactive({})
const rememberMail = ref()

const fileList = ref([
  {
    id: 'url-test',
    name: 'URL Test',
    url: 'https://www.mocky.io/v2/5e4bafc63100007100d8b70f',
    status: 'finished'
  },
  {
    id: 'text-message',
    name: 'Your text messages',
    status: 'error'
  },
  {
    id: 'notification',
    name: 'You notifications',
    status: 'finished'
  },
  {
    id: 'contact',
    name: 'You contact info',
    status: 'finished'
  }
])

function handleUploadChange(data) {
  fileList.value = data.fileList;
}

function handleFileListChange(data) {
  message.info("Yes, file-list changed." + data);
}

// -- options
useHead({ title: '後臺管理' })

definePageMeta({ 
  layout: 'backstage',
})

</script>