<template>
  <div class="min-h-[calc(100vh-24px)] w-[1200px] bg-[#f5f5f5 ]">
    <h2 class="m-12 text-2xl font-black text-gray-700 text-center"> 
      訂單管理
    </h2>
    <div class="min-w-[300px] max-w-[1200px] w-full mx-auto">
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
import { NDataTable } from 'naive-ui';
import OrderTableExpand from '~~/components/backstage/OrderTableExpand.vue';
const isLoading = ref(false)
const isLoadingTable = ref(false)
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0
})


const orderData = ref({})
const tableData = computed(() => orderData.value?.data)
async function getOrderPage() {
  const { data } = await useFetch('/api/order-client', { 
    key: `order${Date.now().toString()}`,
    query: {
      page: pagination.page,
      limit: pagination.pageSize
    }
  })
  orderData.value = data.value
  console.log(orderData.value , tableData.value, pagination);
  pagination.itemCount = data.value.itemCount
}
await getOrderPage()




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
         1:'bg-red-500', 2:'bg-blue-500', 3:'bg-green-500', 4:'bg-gray-500', 90: 'bg-white text-gray-700 border', 99: 'bg-white text-gray-700 border'
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

])

async function handlePageChange(currentPage) {
  if (!isLoadingTable.value) {
    isLoadingTable.value = true
    pagination.page = currentPage
    await getOrderPage()
    isLoadingTable.value = false
  }
}
</script>


<style>
main h1 {
  @apply text-lg text-dark-600 bg-blue-500;
}
.n-data-table-table td {
  white-space: pre-wrap;
}
</style>