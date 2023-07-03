<template>
  <div class="flex justify-center w-full bg-light-400 <sm:(w-full px-2)">
    <div class="flex justify-center  w-[650px] bg-white shadow-md <sm:(w-full)">

      <div class=" mt-12 w-[550px] <sm:(mt-10 w-full)">
        <n-page-header :title="$t('購物車')" @back="$router.back()">
        </n-page-header>
        <div class="w-full">
          <n-card size="small" v-for="({id, name, price, headerImageUrl}, index) in games" :segmented="true" class="my-2">
            <div class="flex">
              <NuxtLink :to="`/game/${id}`" @click="isDrawerActive=!isDrawerActive">
                <div class="flex items-center aspect-square">
                  <img
                    width="100"
                    :src="headerImageUrl"
                  />
                </div>
              </NuxtLink>
              <div class="flex ml-2 px-2 py-2 w-full tracking-wider justify-between <sm:px-0.5">
                <div>
                  <NuxtLink :to="`/game/${id}`" @click="isDrawerActive=!isDrawerActive"
                    class="w-2/3 font-semibold text-md text-green-700/90 ">
                    {{ $t(name) }}
                  </NuxtLink>
                  <div>數位版</div>
                </div>
                <div class="relative text-right w-1/3 font-bold min-w-16">
                  NT${{ price.toLocaleString() }}
                  <div class="absolute bottom-0 right-0">
                    <n-button tertiary circle @click="games.splice(index, 1)">
                      <template #icon>
                        <n-icon color="#966" :component="TrashOutline" />
                      </template>
                    </n-button>
                  </div>
                </div>
              </div>
            </div>
          </n-card>
          <n-card size="small" v-for="({id, name, price, count, isEnough, imageUrl}, index) in products" :segmented="true" class="my-2">
            <div class="flex">
              <NuxtLink :to="`/store/${id}`" @click="isDrawerActive=!isDrawerActive">
                <div class="flex items-center aspect-square">
                  <img
                    width="100"
                    :src="imageUrl"
                  />
                  
                </div>
              </NuxtLink>
              <div class="flex ml-2 px-2 py-2 w-full tracking-wider justify-between <sm:px-0.5">
                <div>
                  <NuxtLink :to="`/store/${id}`" @click="isDrawerActive=!isDrawerActive"
                    class="w-2/3 font-semibold text-md text-green-700/90 ">
                    {{ $t(name) }}
                  </NuxtLink>
                  <div class="flex items-center mt-2">
                    <div>數量：</div>
                    <n-input-number v-model:value="products[index].count" 
                      button-placement="both" size="small" :min="1" :max="quantity"
                      class="w-22"
                    />
                  </div>
                  <div v-if="!isEnough" class="text-red-400">庫存數量不足</div>

                </div>
                <div class="relative text-right w-1/3 font-bold min-w-16">
                  NT${{ price.toLocaleString() }}
                  <div class="absolute bottom-0 right-0">
                    <n-button tertiary circle @click="products.splice(index, 1)">
                      <template #icon>
                        <n-icon color="#966" :component="TrashOutline" />
                      </template>
                    </n-button>
                  </div>
                </div>
              </div>
            </div>
          </n-card>
          <n-select v-model:value="shippingMethod" :options="shippingList" :placeholder="$t('運送方式')"/>

          <div class="mt-5 mr-4 text-lg font-semibold text-right tracking-wider text-gray-00">
            <span>{{ $t('小計金額：') }}</span> <span class="text-rose-600">NT${{ merchPrices.toLocaleString() }}</span>
          </div>
          <div class="flex justify-end mr-4  text-red-600/80 font-semibold">
            <div >( 注意：未包含運費 )</div>
          </div>  
          <div class="flex mt-8">
            <NuxtLink to="/checkout/shipping" class="mx-auto">
              <n-button color="#f78" size="large" :disabled="!isInventoryEnough"
                class="text-white w-48 mx-auto rounded-lg">
                {{ isInventoryEnough ? $t('下一步') : $t('庫存不足')}}
              </n-button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { defineComponent, ref, h, computed } from 'vue'
import { NButton, NInputNumber, NDrawer, NDrawerContent, NCard, NImage, NIcon, NPageHeader, NBreadcrumb, NBreadcrumbItem } from 'naive-ui'
import { TrashOutline, CloseOutline } from "@vicons/ionicons5";
import { storeToRefs } from 'pinia' 
import { useCartStore } from '@/stores/cart' 

const cartStore = useCartStore()
const { products, games } = storeToRefs(cartStore)


const props = defineProps(['isDrawerActive'])
const emit = defineEmits(['update:modelValue'])


const isDrawerActive = computed({
  get() {
    return props.isDrawerActive
  },
  set(value) {
    emit('update:isDrawerActive', value)
  }
})


const cartNumber = computed(() => cartStore.count)
const deliveryfee = computed(() => cartStore.deliveryfee)
const merchPrices = computed(() => cartStore.merchPrices) 
const { data: checkedData } = await useFetch('/api/order-client/verify-inventory', {
  method: 'POST',
  key: 'checkedData:' + Date.now().toString(),
  body: {
    games,
    products
  }
})

const shippingMethod = ref()


const isInventoryEnough = computed(() => {
  return checkedData.value.every(item => item.isEnough)
})

onMounted(() => {
  checkedData.value.forEach((item, index) => {
    products.value
      .find(product => product.id === item.id).isEnough = item.isEnough
  })
})



</script>

<style scoped>
:deep(.n-input__input-el) {
  text-align: center;
}
</style>