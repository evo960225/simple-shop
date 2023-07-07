<template>
  <div class="my-12">
    <div class="grid grid-cols-4 grid-rows-1 w-[1200px] gap-5 justify-center px-6 <xl:w-full <lg:grid-cols-2 <sm:(gap-1 px-2)">
      <div v-for="([key, value], index) in Object.entries(productData) || []" 
        class="group relative p-3 border border-slate-200 rounded-xl m-auto w-full transition-all transform-gpu duration-300
          hover:(shadow shadow-lg )
        ">
        <div class="flex justify-center w-full items-center aspect-square">
          <NuxtLink :to="`/store/${value.id}`" class="h-full">
            <img :src="value.imageUrl" class="w-full h-full object-contain" :loading="index>8?'lazy':''" />
          </NuxtLink>
        </div>

        <div class="w-full px-2 py-4 <sm:(px-0 py-2)">
          <NuxtLink :to="`/store/${value.id}`">
            <n-button text class="text-xl <sm:text-[16px]">
              <div class="my-2 font-semibold">
                {{ $t(value.name || '') }}
              </div>
            </n-button>
          </NuxtLink>
        
        </div>

        <div class="flex mr-2 h-8 ">
          <div class="flex m-auto mr-4 mb-2 absolute bottom-0 right-0 ">
            <span class="my-auto p-2">NT$ {{ value.price }}</span>

            <n-button color="#bbab42" class="my-auto <sm:hidden " @click="productPushCart(value.id)">
              <div class="">
                {{ $t('加入購物車') }}
              </div>
            </n-button>
            <n-button strong circle color="#bbab42" class="hidden <sm:(flex justify-content ml-2)" @click="productPushCart(value.id)">
              <div class="flex justify-content font-black text-lg">
              +
              </div>
            </n-button>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
  
<script setup>
import { NButton, NGrid, NGi, NCard, NIcon } from 'naive-ui'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import { useIsPageLoadingStore } from '@/stores/isPageLoading'
import { useShowErrorMessageStore } from '@/stores/showErrorMesaage'

import { AddOutline } from '@vicons/ionicons5'
const hash = Date.now().toString()
const cartStore = useCartStore()
const loadingStore = useIsPageLoadingStore()
const errorStore = useShowErrorMessageStore()
const { products, count } = storeToRefs(cartStore)

const { data: productData } = await useFetch('/api/product/client', {
  method: 'GET',
  key: 'product-data' + hash
})

// change image url to 500px
productData.value.forEach((x) => {

  // get base url
  const arrUrl = x.imageUrl.split('/')
  const baseUrl = arrUrl.slice(0, -1).join('/')
  const fileName = arrUrl.pop()
  const smallFileName = fileName.split('.')[0] + '-x500.jpg'
  x.imageUrl = `${baseUrl}/small/${smallFileName}`
})


async function productPushCart(id) {

  loadingStore.show()

  const product = productData.value.find((x) => x.id === id)
  const toCart = { type: 'store', count: 1 , ...product}

  const result = await cartStore.putProduct(toCart)
  if (!result) {
    loadingStore.hide()
    await delay(300)
    errorStore.show('加入購物車失敗', '您的購物車中該商品數量大於店內庫存！')
  }
  await delay(500)
  loadingStore.hide()
}

useHead({ title: '商城' })

</script>