<template>
  <div>
    <n-dialog-provider>
      <n-message-provider>
        <div class="m-auto">      
          <NuxtLayout class="relative">
            <NuxtLoadingIndicator />
            <NuxtPage/>
          </NuxtLayout>
        </div>
        <AdultCheck></AdultCheck>
        <n-modal v-model:show="isLoading">
          <div class="bg-white rounded-lg">
          <n-spin :show="isLoading">
            <div class="w-56 h-36"></div>
            <template #description>
              載入中
            </template>
          </n-spin>
          </div>
        </n-modal>
        <n-modal v-model:show="isShowError" :mask-closable="false"
          preset="dialog"
         class="w-[300px]"
        >
          <template #header>
            <div class="font-semibold text-[18px]">{{ errorMessageTitle }}</div>
          </template>
          <div class="bg-white rounded-lg font-semibold">
            {{ errorMessage }}
          </div>
        </n-modal>
      </n-message-provider>
    </n-dialog-provider>
  </div>
  
</template>
<script setup>

import { NMessageProvider, NDialogProvider, NSpin, NModal } from 'naive-ui'
import { useIsPageLoadingStore } from '@/stores/isPageLoading'
import { useUserStore } from '@/stores/user' 
import { useManagerStore } from '@/stores/manager' 
import { useShowErrorMessageStore } from '~~/stores/showErrorMesaage'

const route = useRoute()
const title = computed(() => route.meta.title? `${route.meta.title} - 範例商城` : '範例商城')

const loadingStore = useIsPageLoadingStore()
const userStore = useUserStore()
const managerStore = useManagerStore()
const errorMessageStore = useShowErrorMessageStore()

onMounted(async() => {
  await userStore.refreshProfile()
  await userStore.refreshProfile() // 這裡要兩次，不然會有問題，原因未知
  await managerStore.refreshProfile()
})


const ogImage = (await import('@/assets/images/og.jpg')).default
const ogDescription = '商城'
const appUrl = 'https://hoshiko.live/'
const isLoading = computed({
  get() { return loadingStore.isLoading },
  set(val) {
    if (val) {
      loadingStore.show() 
    } else {
      loadingStore.hide() 
    }
  }
})
const isShowError = computed({
  get() { return errorMessageStore.isShow },
  set(val) {
    if (val) {
      errorMessageStore.show(errorMessageStore.message) 
    } else {
      errorMessageStore.hide() 
    }
  }
})
const errorMessageTitle = computed({
  get() { return errorMessageStore.title },
})
const errorMessage = computed({
  get() { return errorMessageStore.message },
  set(title, message) {
    if (message) {
      errorMessageStore.show(message) 
    } else {
      errorMessageStore.hide() 
    }
  }
})

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - 商城` : '範例商城';
  },
  title: '',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [
    { name: 'description', content: ogDescription },
    { property:'og:type', content: 'website' },
    { property:'og:title', content: title },
    { property:'og:url', content: appUrl },
    { property:'og:description', content: ogDescription },
    { property:'og:image', content: ogImage },

    { name:'twitter:card', content: 'summary_large_image' },
    { property:'twitter:domain', content: appUrl },
    { property:'twitter:url', content: appUrl },
    { name:'twitter:title', content: title },
    { name:'twitter:description', content: ogDescription },
    { name:'twitter:image', content: ogImage },
  ],
  bodyAttrs: {
    class: 'test'
  }
})
</script>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0.1;
  filter: blur(0px);
}


</style>
