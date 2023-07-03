<template>
  <div class="flex w-full my-16 justify-center <md:my-12">
    <div class="w-[1200px] 
      grid grid-cols-2 gap-18 justify-center justify-items-center 
      <xl:w-11/12
      <lg:(grid-cols-1 w-4/5)  
      "
    >
      <div v-for="(value, index) in gameData" 
        class="relative m-auto w-full">
        <div class="w-full aspect-square filter drop-shadow-alice">
          <NuxtLink :to="`/game/${value.id}`">
            <img :src="value.imageUrl" class="w-full rounded-t-[70px] rounded-l-[70px] filter drop-shadow-alice" :loading="index>1?'lazy':''" />
          </NuxtLink>
        </div>

        <div class="w-full text-center">
          <NuxtLink :to="`/game/${value.id}`">
            <n-button text class="text-2xl <sm:text-xl">
              <h2 class="mt-4 mb-2 font-semibold break-words whitespace-pre-wrap">
                {{ $t(value.name || '') }}
              </h2>
            </n-button>
          </NuxtLink>
          <hr class="border-b-3 border-sky-500" />
        </div>
        <div class="text-center">
          <NuxtLink :to="`/game/${value.id}`">
            <n-button text bordered="false" :focusable="false" 
              class="px-16 py-2.5 mt-2 border-[#7A99D8] !border-[3.5px] border-solid rounded-2xl 
              <md:(px-14 py-1.5)"
            >
              <p class="text-xl font-semibold <md:text-lg">
                了解更多
              </p>
            </n-button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { NButton, NGrid, NGi, NCard } from 'naive-ui'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
const cartStore = useCartStore()
const { games, count } = storeToRefs(cartStore)


const headerImages = {}
const { data } = await useFetch(`/api/game/client`)
const gameData = data.value

function gamePushCart(id) {
  const toCart = { type: 'game', ...gameData[id] }
  games.value.push(toCart)
}
useHead({ title: '遊戲'})

</script>