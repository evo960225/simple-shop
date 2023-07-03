<template>
  <div class="px-2 pt-9 pb-5 w-[600px] <sm:w-full">
    <h2 class="p-1 mb-5 text-pink-900 font-black text-xl border-b-3 border-blue-300">我的遊戲</h2>
    <div class="mt-2 p-1 h-full">
      <div v-if="!gameData || gameData.length===0" class="flex justify-center items-center">
        <n-empty  size="large" description="你目前沒有任何遊戲"
          class="mt-[20vh]">
          <template #extra>
            <n-button color="#bbab42" @click="() => navigateTo('/game')">
              {{ $t('前往遊戲商城') }}
            </n-button>
          </template>
        </n-empty>
      </div>
      <div v-else size="small" v-for="({id, name, headerImageUrl}, index) in gameData" :segmented="true" 
        class="px-5 py-4 my-2 shadow shadow-sm rounded-xl border border-gray-200
          transition duration-200 ease-in-out transform-gpu
          hover:(bg-gray-50/50 shadow-md)">
        <div class="flex">
          <NuxtLink :to="`/game/${id}`">
            <div class="flex items-center">
              <img width="150" :src="headerImageUrl"/>
            </div>
          </NuxtLink>
          <div class="flex ml-2 px-2 py-2 w-full tracking-wider justify-between <sm:px-0.5">
            <div class="flex justify-center items-center text-lg ">
              <NuxtLink :to="`/game/${id}`"
                class="w-full font-semibold text-md text-teal-600">
                {{ $t(name) }}
              </NuxtLink>
            </div>
            <div class="relative text-right w-[50px] font-bold min-w-16">
              <div class="absolute bottom-0 right-0 ">
                <n-button tertiary circle @click="showGameFilesDir(id)">
                  <template #icon>
                    <n-icon color="#966" :component="CloudDownloadOutline" />
                  </template>
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- game file  -->
    <n-modal
      v-model:show="isShowModal"
      preset="card"
      class="w-[600px] rounded-lg <sm:w-full pb-3"
    >
      <template #header>
        <div class="font-semibold"> {{ modalGameName }} </div>
      </template>
      <div v-for="{fileName, updated} in gameFilesInfo" class="p-2.5 border-b border-light-900">
        <n-skeleton v-if="isLoading" text :repeat="6" />
        <div v-else class="flex justify-between">
          <div>
            {{ fileName }}
          </div>
          <a :href="`/api/game/${modalGameId}/download/${fileName}`" download>
            <n-icon  :component="CloudDownloadOutline" class="hover:text-gray-400" />
          </a>
        </div>
      </div>
    </n-modal>

  </div>
</template>

<script setup>

import { useI18n } from 'vue-i18n'
import { NButton, NDrawer, NDrawerContent, NCard, NEmpty, NIcon, NModal, NSkeleton } from 'naive-ui'
import { CloudDownloadOutline, CloseOutline } from "@vicons/ionicons5";
import { useCartStore } from '@/stores/cart' 
import { storeToRefs } from 'pinia' 
const { t } = useI18n()
const isLoading = ref(false)
const cartStore = useCartStore()
const isShowModal = ref(false)
const modalGameId = ref('')
const modalGameName = ref('')

const { data: gameData } = await useFetch('/api/user/own-games', {
  method: 'GET',
})


const gameFilesInfo = ref([])
async function showGameFilesDir(id) {
  modalGameId.value = id
  modalGameName.value = gameData.value.find(game => game.id === id).name
  isShowModal.value = true
  isLoading.value = true
  const { data } = await useFetch(`/api/game/${id}/game-files-info`, {
    method: 'GET',
  })
  gameFilesInfo.value = data.value
  isLoading.value = false
}

async function downloadFile(id, fileName) {
  const { data } = await useFetch(`/api/game/${id}/download/${fileName}`, {
    method: 'GET',
  })
  const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
        a.href = url
        a.download = 'file.zip' // 用户下载的PDF文件名
        document.body.appendChild(a)
        a.click()
        a.remove()
}

</script>