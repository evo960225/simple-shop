<template>
  <div class="w-4/5 max-w-[1200px]">
      
    <div class="">
      <div class="mb-2">
        <n-button @click="createNewProduct">新增</n-button>
      </div>
      <div class="flex justify-center">
        <draggable
          :list="productData"
          :disabled="!enabled"
          item-key="name"
          v-bind="dragOptions"
          class="list-group flex flex-wrap justify-start items-center"
          ghost-class="ghost"
          @start="dragging = true"
          @end="dragging = false"
          @change="sortUpdate"
          :component-data="{
            tag: 'ul',
            type: 'transition-group',
            name: !dragging ? 'flip-list' : null
          }"
        >
          <template #item="{ element }">
            <div class="list-group-item relative group cursor-move" :class="{ 'not-draggable': !enabled }">
              <div class="
                w-[230px] rounded-xl shadow-sm p-6 transition-all duration-300 border border-light-500  
                group-hover:(-translate-x-1 -translate-y-1 shadow-md)
              ">
                <div class="flex flex-col justify-content-start items-center">
                  <div class="flex text-gray-800 font-black text-lg mb-0.5 mt-2  ">
                    {{ element.name }}
                  </div>
                  <div class="flex items-center aspect-square  filter transition-all duration-400 group-hover:(blur-2)">
                    <img :src="element.imageUrl" class="w-180px" />
                  </div>
                  <div class="flex w-full"> 
                    <div class="flex text-gray-600 font-semibold flex-grow">
                      數量：{{ element.quantity }} 
                    </div>
                    <div class="flex text-red-600/70 font-semibold flex-shrink-0">
                      ${{ element.price }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="absolute top-2.5 left-2.5 cursor-pointer z-10 text-gray-300" @click="onHotClick(element.id)">
                <div v-if="element.isHot">
                  <Flame class="w-6 z-10 text-red-400 group-hover:text-red-500" />
                </div>
                <div v-else class="">
                  <FlameOutline class="w-6 z-10 group-hover:text-white" />
                </div>
              </div>
              <div class="absolute top-0 opacity-0 invisible rounded-xl
                w-full h-full flex flex-col bg-black/20
                transition-all duration-500
                group-hover:(opacity-100 visible)
              ">
                <div class=" relative text-gray-500 ml-auto cursor-pointer  w-12 h-12 rounded-tr-xl overflow-hidden" @click="deleteGame(element.id)">
                  <n-icon color="#fff" size="18" :component="CloseIcon" class="absolute top-2 right-2 z-2"></n-icon>
                  <div class="absolute top-0 w-25 h-25 bg-[#7A99D8] z-10 transform-gpu rotate-45 translate-x-5 -translate-y-1/2 z-0"></div>
                </div>
                <div class=" text-gray-500 m-auto pb-8 cursor-pointer">
                  <NuxtLink :to="`/backstage/product-editor/${element.id}`">
                    <n-icon color="#fff" size="48" :component="Create"></n-icon>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <n-drawer v-model:show="isDrawerShow" :width="502" :placement="right" :show-mask="false">
      <n-drawer-content closable>
        <template #header>
          <div class="font-black">🔥人氣商品</div>
        </template>
        <div class="flex flex-wrap">
          <div v-for="product in hotProdcuts" class="rounded-lg border-gray-300 border m-2 p-2 shadow-sm ">
            {{ product?.name }}
            <div class="flex items-center aspect-square w-32 filter transition-all duration-400 group-hover:(blur-2)">
              <img :src="product.imageUrl" class="" />
            </div>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
    <n-modal
      v-model:show="showRecheckModal"
      preset="dialog"
      @positive-click="deleteGame(inquireDeleteProduct.id)"
      positive-text="確定"
      negative-text="取消"
      title="警告"
    >
      <template #header>
        <div class="font-black">你確定要刪除該產品嗎?</div>
      </template>
      <div class="px-8 font-bold text-md">此操作將使<span class="text-rose-500 font-black underline ">{{ inquireDeleteProduct.name }}</span>的資料永久刪除!</div>
    </n-modal>

  </div>
</template>
  
<script setup>
  import { NForm, NCard, NInput, NCheckbox, NButton, NDrawer, NDrawerContent, useMessage, NSpin, NModal, NIcon } from 'naive-ui';
  import { CaretBack, CheckmarkCircleSharp, Close as CloseIcon, Image as ImageIcon, Create, Flame, FlameOutline } from "@vicons/ionicons5";
  import { useUserStore } from '@/stores/user' 
  import { useIsPageLoadingStore } from '@/stores/isPageLoading'
  import draggable from 'vuedraggable'
  const enabled =  ref(true)
  const dragging = ref(false)
  const msg = useMessage()
  const loadingStore = useIsPageLoadingStore()
  
  const { data: productData } = await useFetch('/api/product')
  const isDrawerShow = ref(false)
  const dragOptions = ref({
    animation: 400,
    group: "description",
    disabled: false,
    ghostClass: "ghost"
  })

  const hotProdcuts = computed(() => productData.value?.filter((x) => x.isHot))
  console.log('hotProdcuts', hotProdcuts.value);
  const showRecheckModal = ref(false)
  const inquireDeleteProduct = ref()
  
  async function sortUpdate() { 
    gameData.value.forEach((x, i, a) => {
      a[i].sortNumber = i
    })
    const { data:result, error } = await useFetch('/api/product/sort-update', { 
      method: 'POST',
      body: { 
        records: productData.value
      }
    })
  }
  
  async function createNewProduct() {
    loadingStore.show()
    const { data, error } = await useFetch('/api/product/create', { 
      method: 'POST',
    })
    if (error.value) {
      msg.error('無法新增產品!')
    } else {
      loadingStore.hide()
      navigateTo(`/backstage/product-editor/${data.value.id}`)
    }
    loadingStore.hide()
  }
  
  async function deleteButtonHandler(gameRecord) {
    inquireDeleteProduct.value = gameRecord
    showRecheckModal.value = true
  }
  
  async function deleteGame(id) {
    loadingStore.show()
    const { data, error } = await useFetch(`/api/product/${id}`, { 
      method: 'DELETE',
    })
    
    if (error.value) {
      msg.error('無法刪除產品!')
      loadingStore.hide()
    } else {
      loadingStore.hide()
      const router = useRouter();
      router.go();
    }
    
  }
  
  async function onHotClick(id) {
    const index = productData.value.findIndex((x) => x.id === id)
    productData.value[index].isHot = !productData.value[index].isHot
    isDrawerShow.value = true
    const { data, error } = await useFetch(`/api/product/${id}`, { 
      method: 'POST',
      body: productData.value[index]
    })
    if (error.value) {
      msg.error('更新錯誤!' + error.value)
    }

  }
  
  // -- options
  useHead({ title: '產品清單編輯'})
  
  definePageMeta({ 
    layout: 'backstage',
    middleware: ''
  })
  
  </script>
  
  <style lang="scss" scoped>
  .buttons {
    margin-top: 35px;
  }
  .ghost {
    @apply opacity-40 !border-1 !border-dark-100 rounded-md
  }
  .not-draggable {
    cursor: no-drop;
  }
  .list-group-item {
    cursor: move;
  }
  .flip-list-move {
    -webkit-transition: -webkit-transform 0.5s;
    transition: -webkit-transform 0.5s;
    transition: transform 0.5s;
    transition: transform 0.5s, -webkit-transform 0.5s;
  }
  .no-move {
    -webkit-transition: -webkit-transform 0s;
    transition: transform 0s;
    transition: -webkit-transform 0s;
    transition: transform 0s, -webkit-transform 0s;
  }
  </style>