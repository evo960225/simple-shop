<template>
  <div class="flex justify-center py-4 w-full bg-light-500">
    <div class="rounded-md mt-16 px-9 py-5 max-w-[600px] bg-white shadow-md h-[120px]">
      <div class="text-lg my-2 font-semibold tracking-wide text-blue-400">
        您的信箱已驗證！
      </div>
      <div>
        恭喜您完成信箱驗證，您現在可以在艾莉絲商城上盡情購物，感謝您的信任與支持！
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
  