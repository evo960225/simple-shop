<template>
  <div class="flex justify-center w-full min-h-[calc(100vh-70px-94px-10px)]">
    <div class="w-[1200px]">
      <n-data-table
        remote
        size="small"
        :loading="isLoadingTable"
        :row-key="(row) => row.id"
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { googleOneTap } from 'vue3-google-login'
import { NForm, NCard, NInput, NCheckbox, NButton, NSpace, useMessage, NSpin, NModal, NDataTable, NPagination } from 'naive-ui';
import { googleAuthCodeLogin } from 'vue3-google-login'
import { useUserStore } from '@/stores/user' 
import OrderTableExpand from '~~/components/backstage/OrderTableExpand.vue';

const userStore = useUserStore()
const showErrorModal = ref(false)
const modalContent = ref('')
const message = useMessage()
const runtimeConfig = useRuntimeConfig()


const isLoading = ref(false)
const isLoadingTable = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0
})

const result = ref()
async function getOrderPage() {
  const { data } = await useFetch(`/api/order`, {
    query: {
      page: pagination.page,
      limit: pagination.pageSize
    }
  })
  result.value = data.value
  pagination.itemCount = result.value.itemCount
}
getOrderPage()


const tableData = computed(() => result.value?.data)
const loginParams = reactive({})
const columns = ref([
  {
    type: 'expand',
    expandable: () => true,
    renderExpand: (rowData) => {
      return h(OrderTableExpand, { orderData: rowData})
    }
  },  
  {
    title: '訂單編號',
    key: 'orderNumber',
  },
  {
    title: '訂單狀態',
    key: 'status',
    render(row, index) {
      const ls_BgColor = {
         1:'bg-red-500', 2:'bg-blue-500', 3:'bg-green-500', 4:'bg-gray-500', 
         90: 'bg-white text-gray-700 border', 99: 'bg-white text-gray-700 border'
      }
      const bgColor = ls_BgColor[row.statusId]
      return h('div', {class: 'w-24 text-center text-white rounded-2xl cursor-default ' + bgColor}, row.status?.name)
    }
  },
  {
    title: '總金額',
    key: 'totalPrices',
  },
  {
    title: '備註',
    key: 'note',
  },
  {
    title: '成立時間',
    key: 'createdAt',
    render(row, index) {
      return (new Date(row.createdAt)).toLocaleString()
    }
  },
  {
    title: '更新時間',
    key: 'updatedAt',
    render(row, index) {
      return (new Date(row.updatedAt)).toLocaleString()
    }
  },
  {
    title: '',
    key: 'editor',
    render(row, index) {
      return h('div', 
        { 
          class: 'text-white bg-yellow-600 hover:bg-yellow-400 rounded-lg text-center cursor-pointer select-none ',
          onClick(v) {
            navigateTo(`/backstage/order/${row.id}`)
          }
        },
        '編輯'
      )
    }
  },
])

async function handlePageChange(currentPage) {
  if (!isLoadingTable.value) {
    isLoadingTable.value = true
    pagination.page = currentPage
    await getOrderPage()
    isLoadingTable.value = false
  }
}
// -- options
useHead({ title: '訂單管理'})

definePageMeta({ 
  layout: 'backstage',
  middleware: ''
})

</script>
<style>


</style>