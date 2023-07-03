<template>
  <div class="flex justify-center w-full min-h-[calc(100vh-70px-94px-10px)]">
    <div> 

      <!-- goback -->
      <div class="flex mr-2 mt-0.5 mb-2">
        <n-button text class="" @click="goBack">
          <n-icon size="24" color="#555" :component="CaretBack" class="" />
          <div class="pt-0.5 flex-grow font-black text-lg text-cool-gray-700 cursor-pointer" @click="goBack"> 返回 </div>
        </n-button>
      </div>


      <!-- content editor -->
      <div class="p-6 w-[1200px] border border-gray-200">
        
        <div class="flex justify-end mb-5 float-right">
          <div class="mr-1" ><n-button size="small" type="" @click="restoreContent">還原</n-button></div>
          <div><n-button size="small" type="primary" :disabled="!isContentChanged" @click="updateContent">更新</n-button></div>
        </div>


        <div class="space-y-2">
          <div class="flex items-center text-lg text-green-700 tracking-wide font-semibold">
            <div class="w-24">訂單編號：</div>
            <div>{{ orderData?.orderNumber }}</div>
          </div>
          <div class="!my-2.5  border-b-1 border-gray-300"></div>
          <div class="flex items-center h-[32px]">
            <div class="w-24">建立日期：</div>
            <div>{{ new Date(orderData?.createdAt).toLocaleString() }}</div>
          </div>
          <div class="flex items-center h-[32px]">
            <div class="w-24">更新日期：</div>
            <div>{{ new Date(orderData?.updatedAt).toLocaleString() }}</div>
          </div>
          
          <div class="flex items-center h-[32px]">
            <div class="w-24">購買人：</div>
            <div>{{ orderData?.user.nickname }}</div>
          </div>
          <div class="flex items-center h-[32px]">
            <div class="w-24">購買人信箱：</div>
            <div>{{ orderData?.user.email }}</div>
          </div>
          <div class="!my-5 border-b-1 border-gray-300" />
          <div class="flex items-center">
            <div class="w-24">收件人：</div>
            <n-input v-model:value="orderData.recipientName" type="text" placeholder=""  @input="contentChange" />
          </div>
          <div class="flex items-center">
            <div class="w-24">收件人電話：</div>
            <n-input v-model:value="orderData.recipientPhoneNumber" type="text" placeholder="" @input="contentChange" />
          </div>
          <div class="flex items-center">
            <div class="w-24">收件地址：</div>
            <n-input v-model:value="orderData.deliveryAddress" type="text" placeholder=""  @input="contentChange" />
          </div>
          <div class="flex items-center !mt-6">
            <div class="w-24">更新狀態：</div>
            <n-radio-group v-model:value="orderData.statusId" name="radiobuttongroup1" @update:value="contentChange" >
              <n-radio-button
                v-for="status in statusList"
                :key="status.id"
                :value="status.id"
                :label="status.name"
                :disabled="
                  (status.name === '已下單') ||
                  (status.name === '已付款')
                "
              />
            </n-radio-group>
          </div>
        </div>


        <div class="bg-teal-300/50 mt-6 px-3 py-4">
          <div class="mt-0 mb-1">購買遊戲</div>
          <div v-for="x in orderData.games">
            <div class="flex p-2 bg-white shadow shadow-sm rounded-lg space-x-2 items-center border border-gray-200">
              <img :src=" x.game.headerImageUrl" class="w-16 aspect-square object-contain" />
              <div class="w-36"> {{ x.game.name }} </div>
              <div class="w-1/3 text-center"> 數位版 </div>
              <div class="w-1/3 text-center"> {{ `$${x.price}` }}</div>
            </div>
          </div>
          <div class="mt-5 mb-1">購買產品</div>
          <div v-for="x in orderData.products">
            <div class="flex p-2 bg-white shadow shadow-sm rounded-lg space-x-2 items-center border border-gray-200">
              <img :src="x.product.imageUrl" class="w-16" />
              <div class="w-36"> {{ x.product.name }} </div>
              <div class="w-1/3 text-center"> {{ `數量： ${x.product.quantity}` }} </div>
              <div class="w-1/3 text-center"> {{ `$${x.price}` }}</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { NForm, NCard, NInput, NIcon, NButton, NRadioGroup, NRadioButton, NSpin, NModal, useDialog, useMessage } from 'naive-ui';
import { CaretBack } from "@vicons/ionicons5"
import { useIsPageLoadingStore } from '@/stores/isPageLoading'
const loadingStore = useIsPageLoadingStore()
const message = useMessage()
const runtimeConfig = useRuntimeConfig()
const isContentChanged = ref(false)
const dialog = useDialog()
const isLoading = ref(false)
const isLoadingTable = ref(false)
const route = useRoute()
const orderId = route.params.slug 

const { data: orderData, error } = await useFetch(`/api/order/${orderId}`)
const { data: statusList } = await useFetch(`/api/order-status`)
if (error.value) {
  message.error(`發生錯誤：${error.value}`)
}
const restroeTmp = Object.assign({}, orderData.value)



function goBack() {
  if (isContentChanged.value) {
    dialog.warning({
      title: '警告',
      content: '您修改的內容尚未儲存，你是否要離開該頁面?',
      positiveText: '確定',
      negativeText: '取消',
      onPositiveClick: () => {
        navigateTo('./')
      },
      onNegativeClick: () => {
      }
    })
  } else {
    navigateTo('./')
  }
}

function contentChange() {
  isContentChanged.value = true
}

function restoreContent() {
  orderData.value = Object.assign({}, restroeTmp)
  isContentChanged.value = false
}

async function updateContent() {
  loadingStore.show()
  await delay(500)
  const { error } = await useFetch(`/api/order/${orderId}`, {
    method: 'POST', 
    body: orderData.value
  })
  if (error.value) { 
    message.error('更新失敗!')
  } else {
    message.success('更新成功!')
    isContentChanged.value = false
  }
  loadingStore.hide()
}

// -- options
useHead({ title: '訂單編輯'})

definePageMeta({ 
  layout: 'backstage',
})

</script>