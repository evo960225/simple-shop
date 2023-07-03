<template>
  <n-drawer v-model:show="isDrawerActive" :width="drawerWidth" placement="right" class="border-l-3 border-yellow-100">
    <div class="relative">
      <div class="pt-5 pb-4 text-xl font-bold tracking-widest bg-sky-400 text-center text-slate-700">購物車</div>
      <div class="absolute top-1/2 transform -translate-y-1/2 right-4 z-50">
        <n-button quaternary circle @click="isDrawerActive=!isDrawerActive">
          <template #icon>
            <n-icon color="#fff" size="22" :component="CloseOutline" />
          </template>
        </n-button>
      </div>
    </div>
    <n-drawer-content>
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
                class="w-2/3 font-semibold text-md text-yellow-700 ">
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
      <n-card size="small" v-for="({id, name, price, count, imageUrl, quantity}, index) in products" :segmented="true" class="my-2">
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
                class="w-2/3 font-semibold text-md text-yellow-700 ">
                {{ $t(name) }}
              </NuxtLink>
              <div class="flex items-center mt-1">
                <div>數量：</div>
                <n-input-number v-model:value="products[index].count" 
                  button-placement="both" size="small" :min="1" :max="quantity"
                  class="w-22"
                />
              </div>
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
      <div class="mr-6 py-3 text-lg font-semibold text-right tracking-wide">
        <span>小計金額：</span> <span class="text-rose-600">NT$ {{ merchPrices.toLocaleString() }}</span>
      </div>
      <div class="flex mt-6">
        <n-button v-if="cartStore.isEmpty()" color="#fcc" size="large" disabled
        class="text-white w-48  rounded-lg mx-auto" 
        >
          前往結帳  
        </n-button>
        <n-button v-else color="#f78" size="large" @click="goToCheckout"
          class="text-white w-48  rounded-lg mx-auto" 
        >
          前往結帳 
        </n-button>
      </div>
    </n-drawer-content>
  </n-drawer>

</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { NInputNumber, NButton, NDrawer, NDrawerContent, NCard, NImage, NIcon } from 'naive-ui'
import { TrashOutline, CloseOutline, AddCircle } from "@vicons/ionicons5";
import { useCartStore } from '@/stores/cart' 
import { storeToRefs } from 'pinia' 
const drawerWidth = ref(0)
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

onMounted(() => {
  window.addEventListener("resize", () => {
    drawerWidth.value = window.innerWidth > 450 ? 450 :  window.innerWidth
  });
  drawerWidth.value = window.innerWidth > 450 ? 450 :  window.innerWidth
})

const cartNumber = computed(() => cartStore.count)
const merchPrices = computed(() => cartStore.merchPrices)

// 前往結帳
function goToCheckout() {
  if (!cartStore.isEmpty()) {
    isDrawerActive.value = false
    navigateTo('/checkout/cart')
  }
}

</script>
<style scoped>
:deep(.n-drawer-body-content-wrapper) {
  padding: 8px !important;
}
:deep(.n-input__input-el) {
  text-align: center;
}
</style>
