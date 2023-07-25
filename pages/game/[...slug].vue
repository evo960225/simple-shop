<template>
  <div class="w-[1200px] mt-6 mb-16 <xl:w-full <lg:-mt-0">
    <div class="relative flex game_info rounded-xl bg-white z-10">
      <!-- game info -->
      <div class=" relative w-[360px] min-w-[360px] <xl:hidden py-4 border-r-1 border-light-700">
        <h2 class="mb-3">
          <div class="px-4 text-xl font-semibold text-red-400">
            {{ $t(name || '') }}
          </div>
        </h2>
        <div class="m-1">
          <img :src="data.headerImageUrl" />
        </div>
        
        <div class="my-5 border-b-1 bg-light-500"></div>
        
        <p class="text-md px-4 min-h-72 font-semibold tracking-wide text-gray-600 text-justify">
          {{ introduction }}
        </p>
        

        <div class="absolute bottom-3 right-0 w-full">
          <div class="my-4 border-b-1 bg-light-500"></div>
        
            <div class="flex justify-between items-center px-4">
              <div class="flex items-center">
                <NuxtLink to="/">
                  <n-button>實體版</n-button>
                </NuxtLink>
                <div class="w-6 h-6 mx-2 transition-all opacity-85 hover:opacity-60">
                  <a v-if="steamLink" :href="steamLink">
                    <img src="/images/steam.svg">
                  </a>
                </div>
              </div>
             
              <div class="flex mt-0 items-center justify-end justify-items-center mr-0"> 
                <div class="text-xl font-semibold text-red-500  mr-2 text-right tracking-wide">
                  NT$ {{ price }}
                </div>
                <n-button color="#bbab42" class="my-auto" @click="putCart">{{ $t('加入購物車') }}</n-button>
              </div>
            </div>
          </div>    
        </div>

      <!-- carousel -->
      <div class="w-[calc(100%-360px-0px)] p-3 <xl:w-full">
        <div class="hidden px-2 text-xl font-semibold text-red-400 mb-2
        <xl:block">
            {{ $t(name || '') }}
        </div>
        <n-carousel
          v-model:current-index="carouselIndex"
          dot-type="line"
          dot-placement="bottom"
          effect="fade"
          autoplay    
          draggable
          :interval="5000"
          class="carousel w-full h-[465px] m-auto rounded-md <xl:(h-auto aspect-[91/51])"
        >
          <div v-for="url in carouselImages" class>
            <n-image class="carousel-img w-full" :src="`/api/public/images/game/${gameId}/carousel/${url}`" />
          </div>
        </n-carousel>

        <div class="flex mt-0 py-1 w-full overflow-x-scroll">
          <div class="flex">
            <div v-for="(url, index) in carouselImages" 
              class="w-36 border-4 border-transparent rounded-sm filter transition-all duration-300 hover:(border-sky-500)
                <md:w-32"
              :class="{'border-sky-600': index==carouselIndex}"
              @click="carouselIndex=index">
              <img class="carousel-img" :src="`/api/public/images/game/${gameId}/carousel/${url}`" />
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <div class="relative w-[1200px]">
      <button class="absolute rounded-b-xl -top-3 right-4 bg-blue-500 text-white rounded-b-xl pt-4 pb-2 px-6 z-0 shadow-md
        cursor-pointer
        transition-all duration-150 hover:bg-blue-300"
        @click="showGameFilesDir()">
          相關下載
      </button>
    </div>
    <n-divider class="relative -z-10" />

    <!--  description  -->
    <div class="description description-game mt-10">
      <div v-html="descriptionHtml"></div>
    </div>


    <!-- game file  -->
    <n-modal
      v-model:show="isShowModal"
      :loading="isLoading"
      preset="card"
      class="w-[600px] rounded-lg <sm:w-full pb-3"
    >
      <template #header>
        <div class="font-semibold"> {{ $t(name) }} </div>
      </template>
      <div v-for="{fileName, updated} in gamePublicFilesInfo" class="p-2.5 border-b border-light-900">
        <n-skeleton v-if="isLoading" text :repeat="6" />
        <div v-else class="flex justify-between">
          <div>
            {{ fileName }}
          </div>
          <a :href="`/api/game/${gameId}/download/public/${fileName}`" download>
            <n-icon  :component="CloudDownloadOutline" class="hover:text-gray-400" />
          </a>
        </div>
      </div>
    </n-modal>
  </div>
</template>
    
<script setup>
import { NButton, NImage, NCarousel, NDivider, NRadioGroup, NRadioButton, NInputNumber, NModal, NIcon, useMessage } from 'naive-ui'
import { useCartStore } from '@/stores/cart'
import { useIsPageLoadingStore } from '@/stores/isPageLoading'
import { useShowErrorMessageStore } from '@/stores/showErrorMesaage'
import { CloudDownloadOutline, CloseOutline } from "@vicons/ionicons5";
const { t } = useI18n()

const isLoading = ref(false)
const loadingStore = useIsPageLoadingStore()
const showErrorMessageStore = useShowErrorMessageStore()
const cartStore = useCartStore()
const isShowModal = ref(false)
const productCount = ref(1)
const specification = ref()
const carouselIndex = ref(0)
const route = useRoute()
const message = useMessage()
const gameId = parseInt(route.params.slug)

const { data } = await useFetch(`/api/game/${gameId}`)
const { name, folderName, introduction, price, descriptionHtml, steamLink, carouselImages } = data.value




async function putCart() {

  if(await cartStore.haveGame(gameId)) {
    showErrorMessageStore.show('加入購物車失敗','您加入的遊戲已經在購物車中！')
    return
  }

  // 如果客戶有買過此遊戲，則不可再次購買
  loadingStore.show()
  const { data:gamesData, error } = await useFetch(`/api/user/own-games`)
  if (error.value) {
    showErrorMessageStore.show('加入購物車失敗','請先登入！')
    loadingStore.hide()
    navigateTo('/login')
  }


  if (gamesData.value.find(game => game.id === gameId)) {
    showErrorMessageStore.show('加入購物車失敗','您已經擁有此遊戲！')
  } else {
    const toCart = { type: 'game', ...data.value }
    cartStore.putGame(toCart)
    await delay(500)
  }
  loadingStore.hide()
}


const runtimeConfig = useRuntimeConfig()
useHead({ 
  title: name, 
  link: [
    { rel: 'stylesheet', href: `/api/public/styles/description` }
  ]
})

useSeoMeta({
  ogTitle: name,
  description: introduction,
  ogDescription: introduction,
  ogImage: `${runtimeConfig.public.host}/${data.value.headerImageUrl}`,
  twitterImage: `${runtimeConfig.public.host}/${data.value.headerImageUrl}`,
  twitterDescription: introduction,
  twitterCard: 'summary_large_image',
})


// 對外檔案
const gamePublicFilesInfo = ref([])
async function showGameFilesDir() {
  isShowModal.value = true
  isLoading.value = true
  const { data } = await useFetch(`/api/game/${gameId}/game-public-files-info`, {
    method: 'GET',
  })
  gamePublicFilesInfo.value = data.value
  isLoading.value = false
}

</script>

<style>

.game_info {
  box-shadow: #21101040 0px 4px 12px;
}

.carousel {
  aspect-ratio: 180 / 101;
}
.carousel-img img {
  @apply w-full;
}
.description h3 {
  @apply px-3 py-0 mt-6 mb-2 text-large font-semibold text-sky-600 border-l-3 border-yellow-300;
}
.description p,pre {
  @apply px-12 py-3 text-black tracking-wider text-normal <md:whitespace-pre-line;
  text-align: justify;
}
.description ol {
  @apply px-12 py-3 text-black tracking-wider text-normal list-disc list-inside;
}
</style>
