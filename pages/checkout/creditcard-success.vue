<template>
  <div class="flex justify-center py-4 w-full bg-light-500">
    <div class="rounded-md mt-16 px-9 py-5 max-w-[600px] bg-white shadow-md h-[180px]">
      <div class="text-lg my-2 font-semibold tracking-wide text-blue-400">
        感謝您的訂購！
      </div>
      <div>
        您的訂單已經成功提交，我們會儘快處理並安排發貨。如果您的訂單包含數位遊戲內容，您可以在完成付款後立即下載。
        如果您遇到任何問題，請隨時聯繫我們的信箱，再次感謝您！
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { defineComponent, ref, h, computed } from 'vue'
import { NButton, NInput, NSelect, NCard, NImage, NIcon, NPageHeader, NBreadcrumb, NBreadcrumbItem, NForm, NFormItem } from 'naive-ui'
import { useCartStore } from '~~/stores/cart';
const cartStore = useCartStore()
await cartStore.clear()

</script>
  