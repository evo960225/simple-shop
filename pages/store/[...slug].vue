<template>
  <div class="w-[1000px] mt-6 mb-16  <xl:w-[800px] <md:w-auto <sm:(w-full max-w-[450px])">


    <!-- :<md game name -->
    <h2 class="hidden mb-3 <md:block">
      <div class=" px-4 py-2 text-xl font-semibold text-red-400 border-b-1 border-gray-200">
        {{ $t(name) }}
      </div>
    </h2>

    <div class="flex shadow-md <xl:game_info rounded-xl">


      <!-- game info -->
      <div class=" relative w-[650px] m-1 aspect-square border-r-1 border-light-700 
        <xl:(w-[500px]) <md:(border-0)
      ">
        <n-carousel
          dot-type="line"
          dot-placement="bottom"
          effect="fade"
          autoplay    
          draggable
          :interval="5000"
          class="carousel w-full"
        >
          <div v-for="img in imageList" class="m-1 aspect-square">
            <img :src="`${imagePath}/${img}`" class="object-contain aspect-square w-full" />
          </div>
        </n-carousel>
      </div>


      <!-- >=md 數量、加入購物車 -->
      <div class="relative flex flex-col w-1/3 min-w-[300px] p-3 <md:(hidden w-0)">
        <h2 class="mb-3">
          <div class=" px-4 py-2 text-2xl font-semibold text-red-400 border-b-1 border-gray-200">
            {{ $t(name) }}
          </div>
        </h2>
        <p class="text-lg p-4 h-full text-justify"> 
          {{ introduction }}
        </p>
        <div class="my-5 border-b-1 bg-light-500"></div>
        <div class="px-4 py-4 flex flex-col justify-end space-y-3">
          <div class="flex items-center ">
            <div class="mr-5">{{ $t('價格') }} : </div>
            <div class="text-lg font-semibold text-red-500 text-right tracking-wider">
              NT$ {{ price }}
            </div>  
          </div>
          <div class="flex items-center">
            <div class="mr-3">{{ $t('數量') }} : </div>
            <n-input-number v-model:value="productCount" :min="1" :max="quantity" class="w-22 mx-2" />
            <div class="text-gray-500">剩餘：{{ quantity }}</div>
          </div>
          <n-button color="#bbab42" @click="productPushCart" class="my-auto">{{ $t('加入購物車') }}</n-button>
          
        </div>
      </div>

    </div>

    <div class="hidden bg-gray-50 rounded-xl <md:block">
      <p class="p-4 mb-2 h-full text-[16px]"> 
        {{ introduction }}
      </p>
      <div class="px-4 py-4 flex flex-col justify-end space-y-3">
        <div class="flex items-center   ">
          <div class="mr-5 ">{{ $t('價格') }} : </div>
          <div class="text-lg font-semibold text-red-500 text-right tracking-wider">
            NT$ {{ price }}
          </div>  
        </div>

        <div class="flex items-center">
          <div class="mr-3">{{ $t('數量') }} : </div>
          <n-input-number v-model:value="productCount" :min="1" :max="quantity" class="w-22 mx-2" />
          <div class="text-gray-500">剩餘：{{ quantity }}</div>
        </div>
        <n-button color="#bbab42" @click="productPushCart" class="my-auto">{{ $t('加入購物車') }}</n-button>
      </div>
    </div>
    <n-divider class="<md:hidden" />
    <div></div>
    <div class="description description-product mt-10">
      <div v-html="descriptionHtml"></div>
    </div>

  </div>
</template>
    
<script setup>
import { NButton, NImage, NCarousel, NDivider, NRadioGroup, NRadioButton, NInputNumber } from 'naive-ui'
import { useCartStore } from '@/stores/cart'
import { useIsPageLoadingStore } from '@/stores/isPageLoading'
import { useShowErrorMessageStore } from '@/stores/showErrorMesaage'

const loadingStore = useIsPageLoadingStore()
const errorStore = useShowErrorMessageStore()
const cartStore = useCartStore()
const productCount = ref(1)
const specification = ref()
const carouselIndex = ref(0)
const carouselImages = ref([])

const route = useRoute()
const productId = route.params.slug 

const { data: product } = await useFetch(`/api/product/${productId}` , {
  method: 'GET'
})
const { name, game, quantity, price, introduction, descriptionHtml } =  product.value

async function productPushCart() {
  loadingStore.show()
  product.value.count = productCount.value
  const toCart = { type: 'store', ...product.value }
  const result = await cartStore.putProduct(toCart)
  if (!result) {
    loadingStore.hide()
    await delay(300)
    errorStore.show('加入購物車失敗', '您的購物車中該商品數量大於店內庫存！')
  }
  await delay(500)
  loadingStore.hide()
}

const imageList = ref(product.value.carouselImages)
const runtimeConfig = useRuntimeConfig()
const filePath = '/api/public/images/product'
const imagePath = `${filePath}/${productId}`

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
  ogImage: `${runtimeConfig.public.host}${imagePath}/${imageList.value[0]}`,
  twitterImage: `${runtimeConfig.public.host}${imagePath}/${imageList.value[0]}`,
  twitterDescription: introduction,
  twitterCard: 'summary_large_image',
})

</script>


<style>
.n-carousel__dot {
  background: aquamarine !important;
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