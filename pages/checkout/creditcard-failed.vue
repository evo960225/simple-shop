<template>
<div class="flex justify-center py-4 w-full bg-light-500">
  <div class="rounded-md mt-16 px-9 py-5 max-w-[600px] bg-white shadow-md h-[160px]">
    <div class="text-lg my-2 font-semibold tracking-wide text-blue-400">
      您的付款未成功！
    </div>
    <p>
      請檢查您的信用卡號碼是否輸入正確或者連繫銀行，並再一次進行結帳。
      如果您需要更多的協助，請可以通過電子郵件來聯繫我們。
    </p>
  </div>
</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { defineComponent, ref, h, computed } from 'vue'
import { NButton, NInput, NSelect, NCard, NImage, NIcon, NPageHeader, NBreadcrumb, NBreadcrumbItem, NForm, NFormItem } from 'naive-ui'
import { TrashOutline, CloseOutline } from "@vicons/ionicons5";
const formRef = ref()


</script>
  