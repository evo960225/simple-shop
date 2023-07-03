<template>
  <div class="shadow rounded w-[300px] p-4">
    <div class="font-semibold text-lg border-b border-blue-400 mb-4">運費</div>
    <div v-for="x in shippingData">
      <div class="flex items-center">
        <label class="w-24">{{  x.name  }}</label>
        <n-input-number class="w-36" v-model:value="x.deliveryFee" :step="5" :min="0" @change="x.isChanged=true">
          <template #prefix>
          $
          </template>
        </n-input-number>
        <button 
          class="flex items-center p-2 w-8 text-yellow-200 font-black hover:text-yellow-500 transition-all" 
          :class="{ '!text-yellow-700': x.isChanged }"
          @click="updateFee(x.id, x.deliveryFee)"
        >
          <Checkmark></Checkmark>
        </button>
      </div>
    </div>
  </div>
</template>
  
<script setup>
  import { googleOneTap } from 'vue3-google-login'
  import { NForm, NCard, NInput, NInputNumber, NButton, NSpace, useMessage, NSpin, NModal } from 'naive-ui';
  import { CaretBack, CheckmarkCircleSharp, Close as CloseIcon, Image as ImageIcon, AddCircle, AddCircleOutline, RemoveCircle, RemoveCircleOutline, Checkmark, CheckmarkCircleOutline, CloseOutline } from "@vicons/ionicons5";
  import { useManagerStore } from '@/stores/manager' 
  const message = useMessage()

  const { data: shippingData } = await useFetch('/api/order/shipping-method')
  shippingData.value.forEach((x, i, a) => {
    shippingData.value[i].isChanged = false 
  })


  function updateFee(id, fee) {
    const { data, error } = useFetch('/api/order/shipping-method/update', {
      method: 'POST',
      body: {
        id,
        deliveryFee: fee
      }
    })
    if (error.value) {
      message.error(err.value.message)
    } else {
      message.success('更新成功')
      shippingData.value.forEach((x, i, a) => {
        if (x.id === id) {
          shippingData.value[i].isChanged = false 
        }
      })
    }
  }

  // -- options
  useHead({ title: '其他設定'})
  definePageMeta({ 
    layout: 'backstage',
  })
</script>    