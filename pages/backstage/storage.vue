<template>
  <div class="storage mt-4 w-4/5 max-w-[1200px]">

    <div class="">
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

    <n-modal
      v-model:show="showRecheckModal"
      preset="dialog"
      @positive-click="deleteProduct(inquireDeleteProduct.id)"
      positive-text="確定"
      negative-text="取消"
      title="警告"
    >
      <template #header>
        <div class="font-black">你確定要刪除該產品嗎?</div>
      </template>
      <div class="px-8 font-bold text-md">此操作將使<span class="text-rose-500 font-black underline">{{ inquireDeleteProduct.name }}</span>的資料永久刪除!</div>
    </n-modal>

  </div>
</template>
  
<script setup>
  import { NForm, NCard, NInput, NInputNumber, NCheckbox, NButton, useMessage, NSpin, NModal, NDataTable, NPagination, NImage } from 'naive-ui';
  import { CaretBack, CheckmarkCircleSharp, Close as CloseIcon, Image as ImageIcon, AddCircle, AddCircleOutline, RemoveCircle, RemoveCircleOutline, Checkmark, CheckmarkCircleOutline, CloseOutline } from "@vicons/ionicons5";
  import { useUserStore } from '@/stores/user' 
  import { useIsPageLoadingStore } from '@/stores/isPageLoading'
  import draggable from 'vuedraggable'
  const enabled =  ref(true)
  const isContentChanged = ref(false)
  const msg = useMessage()
  const loadingStore = useIsPageLoadingStore()
  const isLoadingTable = ref(false)

  const pagination = reactive({ 
    pageSize: 10,
    page: 1,
    itemCount: 0
  })

  const productData = ref()
  async function getStoragePage() {
    const { data } = await useFetch(`/api/order/pending-shipment`, {
      query: {
        page: pagination.page,
        pageSize: pagination.pageSize
      }
    })
    productData.value = data.value.data
    productData.value.forEach((x, i, a) => {
      productData.value[i].isChanged = false 
    })
    pagination.itemCount = data.value.total
  }
  await getStoragePage()


  const restroeTmp = JSON.parse(JSON.stringify(productData.value))
  const tableData = computed(() => productData.value)




  async function handlePageChange(currentPage) {
    if (!isLoadingTable.value) {
      isLoadingTable.value = true
      pagination.page = currentPage
      getStoragePage()
      isLoadingTable.value = false
    }
  }
  const columns = ref([
    {
      title: '圖片',
      key: 'id',
      render (row, index) {
        return h(NImage, {
          src: row.imageUrl,
          'object-fit': 'contain',
          class: 'h-12 w-12'
        })
      }
    },
    {
      title: '名稱',
      key: 'name',
    },
    {
      title: '遊戲名',
      key: 'game.name',
    },
    // {
    //   title: '未售 / 庫存',
    //   key: 'quantity',
    //   render (row, index) {
    //     return h('div',
    //       { class: 'flex items-center'},
    //       [
    //         h('div', {'class': 'w-16'}, `${row.quantity} / ${row.quantity}`),
    //       ]
    //     )
    //   }
    // },
    {
      title: '庫存異動',
      key: '',
      render (row, index) {
        return h('div',
          { class: 'flex items-center w-36'},
          [
            h(NInputNumber, {
              class: 'text-red-300',
              value: row.quantity,
              min: -row.quantity,
              onUpdateValue(v) {
                productData.value[index].quantity = v
                productData.value[index].isChanged = true
              }
            }),
            h('div', { class: 'flex items-center ml-2 w-12 select-none' }, [
              h('div', {
                'class': `group flex w-5 transition-gpu duration-300 ${row.isChanged? 'cursor-pointer text-red-400' : 'cursor-not-allowed text-gray-200'}`,
                async onClick(v) {
                  if (!row.isChanged) return
                  const { data, error } = await useFetch(`/api/product/${row.id}`, {
                    method: 'POST',
                    body: row
                  })
                  productData.value[index].isChanged = false
                  if(error.value) {
                    msg.error('更新失敗，原因:' + error.value)
                  } else {
                    msg.success('更新成功!')
                  }
                } 
                }, [
                  h(Checkmark, { class: '' }), 
                ]
              ),
              h('div', {
                'class': `group flex w-5 transition-gpu duration-300 ${row.isChanged? 'cursor-pointer text-blue-400' : 'cursor-not-allowed text-gray-200'}`,
                onClick(v) {
                  productData.value[index].quantity = restroeTmp[index].quantity
                  productData.value[index].isChanged = false
                } 
                }, [
                  h(CloseOutline, { class: '' }), 
                ]
              )
            ])
          ]
        )
      }
    },
    {
      
      title: '待出貨',
      key: 'pendingShipmentCount',
      render (row, index) {
        return row.pendingShipmentCount
      }
    },
    {
      title: '價格',
      key: 'price',
    },
    {
      title: '顯示頁面',
      key: 'isShow',
      align: 'center',
      render (row, index) {
        return h(NCheckbox,{
          checked: row.isShow,
          async onUpdateChecked (v) {
            productData.value[index].isShow = v
            const { data, error } = await useFetch(`/api/product/${row.id}`, {
              method: 'POST',
              body: row
            })
            if(error.value) {
              msg.error('更新失敗，原因:' + error.value)
            } else {
              msg.success('更新成功!')
            }
          }
        })
      }
    },
      
  ])

  const dragOptions = ref({
    animation: 400,
    group: "description",
    disabled: false,
    ghostClass: "ghost"
  })

  const showRecheckModal = ref(false)
  const inquireDeleteProduct = ref()
  
  async function deleteButtonHandler(gameRecord) {
    inquireDeleteProduct.value = gameRecord
    showRecheckModal.value = true
  }
  
  async function deleteProduct(id) {
    loadingStore.show()
    const { data, error } = await useFetch(`/api/product/${id}`, { 
      method: 'DELETE',
    })
    
    if (error.value) {
      msg.error('無法刪除遊戲!')
      loadingStore.hide()
    } else {
      loadingStore.hide()
      const router = useRouter();
      router.go();
    }
    
  }
  
  
  
  // -- options
  useHead({ title: '庫存管理'})
  
  definePageMeta({ 
    layout: 'backstage',
    middleware: ''
  })
  
</script>
  
<style lang="scss">

  .storage .n-input-wrapper .n-input__input .n-input__input-el {
    @apply text-green-600;
  }
</style>