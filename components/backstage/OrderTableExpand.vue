<template>
  <div class="bg-teal-100/50 p-4">
    <div class="mb-1 p-1 text-md font-semibold tracking-wider">
      <div><span class="w-20 inline-block">收件人：</span> {{ orderData.recipientName }}</div>
      <div><span class="w-20 inline-block">電話：</span> {{ orderData.recipientPhoneNumber }}</div>
      <div><span class="w-20 inline-block">運送地址：</span> {{ orderData.deliveryAddress }}</div>
      <div><span class="w-20 inline-block">寄送方式：</span> {{ orderData.shippingMethod.name }}</div>
      <div><span class="w-20 inline-block">運費：</span> ${{ orderData.shippingMethod.deliveryFee }}</div>
    </div>

    <div v-for="x in games">
      <div class="flex p-2 bg-white shadow shadow-sm rounded-lg space-x-2 items-center border border-gray-200">
        <img :src="x.game.headerImageUrl" class="w-16 aspect-square object-contain" />
        <div class="w-36"> {{ x.game.name }} </div>
        <div class="w-1/3 text-center"> 數位版 </div>
        <div class="w-1/3 text-center"> {{ `$${x.price}` }}</div>
      </div>
    </div>
    <div v-for="x in products">
      <div class="flex p-2 bg-white shadow shadow-sm rounded-lg space-x-2 items-center border border-gray-200">
        <img :src="x.product.imageUrl" class="w-16" />
        <div class="w-36"> {{ x.product.name }} </div>
        <div class="w-1/3 text-center"> {{ `數量： ${ x.quantity }` }} </div>
        <div class="w-1/3 text-center"> {{ `$${x.price}` }}</div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { defineComponent, ref, h, computed } from 'vue'
import { NButton, NIcon, NSpace, NSwitch, NMenu, NDropdown, NBadge, NDrawer, NDrawerContent, NCard, NImage, NText } from 'naive-ui'
const runtimeConfig = useRuntimeConfig()

const props = defineProps(['orderData'])
const orderData = computed(() => props.orderData)
const games = computed(() => props.orderData.games)
const products = computed(() => props.orderData.products)
</script>

<style>


</style>