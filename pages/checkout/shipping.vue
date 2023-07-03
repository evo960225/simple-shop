<template>
  <div class="flex justify-center w-full bg-light-400 ">
    <div class="py-4 w-[800px] bg-white px-12 py-4 shadow-md <sm:px-1">
      <n-page-header :title="$t('配送方式 & 付款')" @back="$router.back()">
        <template #header>
          <n-breadcrumb separator=">"  class="text-lg">
            <n-breadcrumb-item>{{ $t('購物車') }}</n-breadcrumb-item>
            <n-breadcrumb-item>{{ $t('配送方式 & 付款') }}</n-breadcrumb-item>
          </n-breadcrumb>
        </template>
      </n-page-header>
      <div class="mt-5">
        <n-card class="">
          <n-form
            ref="formRef"
            :label-width="80"
            :model="formValue"
            :rules="rules"
          >
            <n-form-item :label="$t('運送方式')" path="shippingMethod">
              <n-select v-model:value="formValue.shippingMethod" :options="shippingOptions" :placeholder="$t('運送方式')"
                @change="changeShippingMethod" />
            </n-form-item>
            <n-form-item :label="$t('收件人')" path="recipientName">
              <n-input v-model:value="formValue.recipientName" :placeholder="$t('輸入名稱')" />
            </n-form-item>
            <n-form-item :label="$t('收件人電子信箱')" path="recipientEmail">
              <n-input v-model:value="formValue.recipientEmail" :placeholder="$t('輸入信箱')" />
            </n-form-item>
            <n-form-item :label="$t('收件人電話')" path="recipientPhoneNumber">
              <n-input-group>
                <n-input-group-label>+886</n-input-group-label>
                <n-input v-model:value="formValue.recipientPhoneNumber" :placeholder="$t('範例：0912345678')" />
              </n-input-group>
            </n-form-item>
            <n-form-item :label="$t('運送地址')" path="deliveryAddress">
              <n-input-group>
                <n-select class="w-1/4 min-w-[80px]" v-model:value="selectedCity" :options="selectCityOptions" placeholder="縣市" @update-value="selectedArea=null"/>
                <n-select class="w-1/4 min-w-[80px]" v-model:value="selectedArea" :options="selectAreaOptions" placeholder="鄉鎮區" />
                <n-input v-model:value="deliveryAddressLine" :placeholder="$t('運送地址')" />
              </n-input-group>
            </n-form-item>
            <n-form-item :label="$t('備註')" path="note">
              <n-input v-model:value="formValue.note" type="textarea" placeholder="" />
            </n-form-item>
            <hr class="my-5">
            <n-form-item :label="$t('付款方式')" path="paymentTypeId">
              <n-select v-model:value="formValue.paymentTypeId" :options="paymentOptions" :placeholder="$t('付款方式')"/>
            </n-form-item>
          </n-form>
        </n-card>

        <div class="flex flex-col justify-end mt-8 space-y-3 text-[16px] font-semibold tracking-wide">
          <div class="flex justify-end text-gray-700">
            <div class="">小計：</div>
            <div class="w-22 text-right">NT$ {{ merchPrices?.toLocaleString() }}</div>
          </div>
          <div class="flex justify-end text-gray-700">
            <div class="">運費：</div>
            <div class="w-22 text-right">NT$ {{ deliveryPrice?.toLocaleString() }}</div>
          </div>
          <div class="flex justify-end text-red-600/90">
            <div class="">合計：</div>
            <div class="w-22 text-right">NT$ {{ totalPrices?.toLocaleString() }}</div>
          </div>
        </div>
        <div class="mt-5 mb-3 border-b-1 border-gray-200">  </div>
        <div class="flex mt-5 mb-4">
          <n-button color="#f78" size="large" class="text-white w-48 rounded-lg mx-auto" :disabled="totalPrices===0" @click="handleNextButton">
              {{ $t('結帳') }}
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { defineComponent, ref, h, computed } from 'vue'
import { NButton, NInput, NSelect, NCard, NInputGroup, NInputGroupLabel, NIcon, NPageHeader, NBreadcrumb, NBreadcrumbItem, NForm, NFormItem, useMessage } from 'naive-ui'
import { storeToRefs } from 'pinia' 
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart' 
import { useIsPageLoadingStore } from '@/stores/isPageLoading'
import { TrashOutline, CloseOutline } from "@vicons/ionicons5";
import taiwanCityData from '@/assets/json/taiwan-city-county.json'


const userStore = useUserStore()
const cartStore = useCartStore()
const isPageLoadingStore = useIsPageLoadingStore()
const { products, games, merchPrices, deliveryfee, totalPrices, deliveryPrice } = storeToRefs(cartStore)
const runtimeConfig = useRuntimeConfig()

const { serviceName } = runtimeConfig.public

// 載入地址
const selectCityOptions = taiwanCityData.map((x) => {
  return {
    label: x.CityName,
    value: x.CityName,
    areaList: 
      x.AreaList.map((y) => {
        return {
          label: y.AreaName,
          value: y.AreaName,
          ZipCode: y.ZipCode
        }
      })
  }
})

// 載入運送方式
const { data:shippingData } = await useFetch('/api/order/shipping-method')

const shippingOptions = computed(() => { 

  let isOnlyDigital = false
  if (products.value.length === 0 && games.value.length > 0) {
    formValue.value.shippingMethod = 0
    shippingData.value.forEach((x) => {
      if (x.id === 0) {
        deliveryfee.value = parseInt(x.deliveryFee)
      }
    })
    isOnlyDigital = true
  } else {
    shippingData.value.forEach((x) => {
      if (x.id === 1) {
        deliveryfee.value = parseInt(x.deliveryFee)
      }
    })
    formValue.value.shippingMethod = 1
  }


  return shippingData.value.map((x) => {
    const enabled = (x.id === 0 && isOnlyDigital) || (x.id === 1 && !isOnlyDigital)

    return {
      label: `${x.name} (${x.deliveryFee}元)`,
      value: x.id,
      deliveryFee: x.deliveryFee,
      disabled: !enabled
    }
  })
})

// 載入付款方式
const selectAreaOptions = computed(() => {
  const filtered = selectCityOptions.filter((x) => {
    return x.value === selectedCity.value
  })
  if (!filtered || filtered.length === 0 ) return []
  return filtered[0].areaList
})

const message = useMessage()
const selectedCity =  ref('臺北市')
const selectedArea = ref()
const deliveryAddressLine = ref()
const formRef = ref()
const formValue = ref(
  {
    recipientName: '',
    recipientEmail: '',
    recipientPhoneNumber: '',
    deliveryAddress: computed(() => {
      return selectedCity.value + selectedArea.value + deliveryAddressLine.value
    }),
    shippingMethod: 1,
    paymentTypeId: 1,
  }
)
changeShippingMethod(formValue.value.shippingMethod)

const rules = ref({
  recipientName: {
    required: true,
    message: '請填寫姓名',
    trigger: ['input']
  },
  recipientPhoneNumber: [{
      required: true,
      message: '請填寫電話',
      trigger: ['input']
    },{
      validator: (_, value) => useTestTaiwanPhoneFormat('+886' + value),
      message: '電話格式錯誤',
      trigger: ['blur']
    }
  ],
  recipientEmail: [
    {
      required: true,
      message: '請填寫信箱',
      trigger: ['input']
    },
    {
      validator: (_, value) => useTestEmailFormat(value),
      message: '信箱格式錯誤',
      trigger: ['blur']
    }
  ],
  deliveryAddress: [
    {
      required: true,
      message: '請填寫地址',
      trigger: ['input']
    },
    {
      validator: (_, value) => {
        return !!(selectedCity.value && selectAreaOptions.value && deliveryAddressLine.value)
      },
      message: '寄送地址請填寫完整',
      trigger: ['blur']
    }
  ],
  shippingMethod: {
    type: 'number',
    required: true,
    message: '請填寫運送方式',
    trigger: ['input']
  },
  note: {
    required: false,
    message: '請填寫備註',
    trigger: ['input']
  },
  paymentTypeId: {
    type: 'number',
    required: true,
    message: '',
    trigger: ['input']
  },
})

const paymentOptions = ref([
  {
    label: "信用卡",
    value: 1
  },
])

async function changeShippingMethod(methodId) {
  shippingOptions.forEach((x) => {
    if (x.value === methodId) {
      deliveryfee.value = parseInt(x.deliveryFee)
    }
  })
}

async function handleNextButton() {
  console.log(products.value);
  formRef.value.validate(async(errors) => {
    if (errors) {
      message.error('請填寫完整資料！')
    } else {
      isPageLoadingStore.show() 

      const orderGames = games.value.map(game => {
        const { id, price } = game
        return { gameId: id, price }
      })

      const orderProducts = products.value.map(product => {
        const { id, price, count } = product
        return { productId: id, price, quantity: count }
      })
      const { data: orderData, error:checkoutError } = await useFetch('/api/order-client/checkout', {
        method: 'POST',
        body: {
          userId: userStore.profile?.id,
          deliveryAddress:formValue.value?.deliveryAddress,
          recipientPhoneNumber: formValue.value?.recipientPhoneNumber.startsWith('0') ? 
            '+886' + formValue.value.recipientPhoneNumber.substring(1) : 
            '+886' + formValue.value.recipientPhoneNumber,
          shippingMethodId: parseInt(formValue.value.shippingMethod),
          paymentTypeId: parseInt(formValue.value.paymentTypeId),
          totalPrices: totalPrices.value,
          games: orderGames,
          products: orderProducts,
          ...formValue.value,
        }
      })

      isPageLoadingStore.hide() 
      if (checkoutError.value) {
        if (checkoutError.value.status === 400) {
          if(checkoutError.value.message === 'Insufficient inventory.') {
            message.error('庫存不足，無法建立訂單！')
          }
          message.error('金額錯誤，無法新增訂單！')
        } else {
          message.error('資料錯誤，無法新增訂單！')
        }
        return
      } 

      
      const formData = new FormData()
      formData.append('WebNo', '82882240')
      formData.append('PassCode', orderData.value.passCode)
      formData.append('ReceiverName', orderData.value.recipientName)
      formData.append('ReceiverID', orderData.value.recipientPhoneNumber)
      formData.append('ReceiverTel', orderData.value.recipientPhoneNumber)
      formData.append('ReceiverEmail', orderData.value.recipientEmail)
      formData.append('OrderNo', orderData.value.orderNumber)
      formData.append('ECPlatform', serviceName)
      formData.append('TotalPrice', orderData.value.totalPrices)
      formData.append('OrderInfo', `orderProdcuts: ${orderData.value.products.map((x) => x.name)}, createTime: ${orderData.value.createTime}`)
      formData.append('PayType', (orderData.value.paymentTypeId).toString().padStart(2, '0'))
      formData.append('AtmRespost','0')
      formData.append('Deadline','0')
      formData.append('PayEN', '0')
      formData.append('EPT', '1')


      const formFields = Array.from(formData.entries());
      const formElement = document.createElement("form");
      formElement.method = 'POST';
      formElement.action = `${runtimeConfig.public.paynowUrl}/service/etopm.aspx`;
      formFields.forEach(function(field) {
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = field[0];
        inputElement.value = field[1];
        formElement.appendChild(inputElement);
      });
      document.body.appendChild(formElement);
      if (process.env.NODE_ENV === 'production' && runtimeConfig.public.buildTest) {
        message.info('目前購物功能尚未開放，敬請見諒！')
      } else {
        formElement.submit();
      }

    }

  })
}
  

</script>
  