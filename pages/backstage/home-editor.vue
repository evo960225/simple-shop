<template>
  <div class="w-[1200px] mt-2 mb-16 <xl:(w-full p-4) <lg:-mt-0">
    <h2 class="text-lg font-black border-b-1 mb-3">輪播圖片</h2>

    <draggable
      :list="banners"
      :disabled="!enabled"
      item-key="id"
      class="list-group flex flex-wrap"
      ghost-class="ghost"
      v-bind="dragOptions"
      @start="dragging = true"
      @end="dragging = false"
      @change="sortUpdate"
      :component-data="{
        tag: 'div',
        type: 'transition-group',
        name: !dragging ? 'flip-list' : null
      }"
    >
      <template #item="{ element }">
        
        <div class="relative w-[290px] group cursor-move" style="aspect-ratio:1600/760;">
          <img :src="`${element.imageUrl}`" class="filter transition-all  group-hover:(brightness-50) focus-within:(brightness-50)" />
          <div class="
            absolute w-full h-full top-0
            hidden justify-center items-center group-hover:(flex flex-col) focus-within:(flex flex-col brightness-50)
          ">
            <n-button text class="absolute top-0 right-0 p-2 font-black text-[20px] text-right hover:opacity-70" @click="deleteImage(element.id)">   
              <n-icon color="#fff" :component="CloseIcon"></n-icon>
            </n-button> 
            <div class="relative -mt-2">
              <div class="text-white py-1">插入超連結</div>
              <div class="flex">  
                <n-input placeholder="連結網址" @input="isUrlChanged[element.id]=true" v-model:value="element.hyperLink" class=""></n-input>
                <n-button text class="ml-2 font-black text-[28px] transition-all duration-400 filter brightness-80" 
                  :class="{'!brightness-100': isUrlChanged[element.id], '!hover:brightness-120': isUrlChanged[element.id]}"
                  @click="updateBlock(element.id, element)"
                >
                  <n-icon color="#dda" :component="CheckmarkCircleSharp"></n-icon>
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>
    <n-spin :show="isUploadImage">
      <n-upload class="w-full group"  :multiple="false" method="PUT" action="/api/home/banner" name="image" 
        @before-upload="beforeUploadCarouselImage"
        @finish="handelFinish"
      >
        <div class="flex justify-center items-center aspect-760/1600 w-[290px] border-2 border-dashed border-blue-500/70 text-center cursor-pointer">
          <div class="text-blue-500/70 text-xl font-bold w-full my-auto h-min">
            上傳圖片+<br>
            <div class="text-sm">({{ imageCarouselSize.width  }}x {{ imageCarouselSize.height }})</div>
          </div>
        </div>
      </n-upload>
    </n-spin>


    <!-------->
    <h2 class="text-lg font-black border-b-1 mt-16 mb-3">輪播下方圖塊</h2>
    <draggable
      :list="blocks"
      :disabled="!blockEnabled"
      item-key="id"
      class="list-group flex flex-wrap"
      ghost-class="ghost"
      v-bind="dragOptions"
      @start="draggingBlock = true"
      @end="dragging = false"
      @change="sortBlockUpdate"
      :component-data="{
        tag: 'div',
        type: 'transition-group',
        name: !dragging ? 'flip-list' : null
      }"
    >
      <template #item="{ element }">
        
        <div class="relative w-[240px] group cursor-move" style="aspect-ratio:290/232;">
          <img :src="`${element.imageUrl}`" class="filter transition-all  group-hover:(brightness-50) focus-within:(brightness-50)" />
          <div class="
            absolute w-full h-full top-0
            hidden justify-center items-center group-hover:(flex flex-col) focus-within:(flex flex-col brightness-50)
          ">
            <n-button text class="absolute top-0 right-0 p-2 font-black text-[20px] text-right hover:opacity-70" @click="deleteBlockImage(element.id)">   
              <n-icon color="#fff" :component="CloseIcon"></n-icon>
            </n-button> 
            <div class="relative -mt-2 px-2">
              <div class="text-white py-1">插入超連結</div>
              <div class="flex">  
                <n-input placeholder="連結網址" @input="isBlockUrlChanged[element.id]=true" v-model:value="element.hyperLink" class=""></n-input>
                <n-button text class="ml-0.5 font-black text-[28px] transition-all duration-400 filter brightness-80" 
                  :class="{'!brightness-100': isBlockUrlChanged[element.id], '!hover:brightness-120': isBlockUrlChanged[element.id]}"
                  @click="updateBlock(element.id, element)"
                >
                  <n-icon color="#dda" :component="CheckmarkCircleSharp"></n-icon>
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>
    <n-spin :show="isUploadImage">
      <n-upload class="w-full group" :multiple="false" method="PUT" action="/api/home/block" name="image" 
        @before-upload="beforeUploadBlockImage"
        @finish="handelBlockFinish"
      >
        <div class="flex justify-center items-center w-[240px] border-2 border-dashed border-blue-500/70 text-center cursor-pointer" style="aspect-ratio:290/232;">
          <div class="text-blue-500/70 text-xl font-bold w-full my-auto h-min">
            上傳圖片+<br>
            <div class="text-sm">({{ imageBlockSize.width  }}x {{ imageBlockSize.height }})</div>
          </div>
        </div>
      </n-upload>
    </n-spin>
  </div>
</template>
    
<script setup>
import { NInput, NInputNumber, NButton, NImage, NIcon, NCheckbox, NUpload, NSpin, NTabs, NTabPane, useMessage, useDialog } from 'naive-ui'
import draggable from 'vuedraggable'
import { useIsPageLoadingStore } from '@/stores/isPageLoading'
import { CaretBack, CheckmarkCircleSharp, Close as CloseIcon, Image as ImageIcon } from "@vicons/ionicons5";
const message = useMessage()
const dialog = useDialog()
const loadingStore = useIsPageLoadingStore()
const route = useRoute()
const gameId = route.params.slug
const enabled =  ref(true)
const dragging = ref(false)
const isUrlChanged = reactive({})
const isUploadImage = ref(false)
const imageCarouselSize = {
  width: 1600,
  height: 760
}


const blockEnabled =  ref(true)
const draggingBlock = ref(false)
const isBlockUrlChanged = reactive({})
const imageBlockSize = {
  width: 500,
  height: 400
}

const dragOptions = ref({
  animation: 300,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
})
const { data: banners } = await useFetch(`/api/home/banners`, { method: 'GET' })
const { data: blocks } = await useFetch(`/api/home/blocks`, { method: 'GET' })


async function updateBanner(id, content) {
  loadingStore.show()
  const { error } = await useFetch(`/api/home/banner`, {
    method: 'POST',
    body: content
  })
  if (error.value) {
    message.error('連結更新失敗!')
    loadingStore.hide()
  }

  isUrlChanged[id] = false
  loadingStore.hide()
}

async function deleteImage(id) {
  loadingStore.show()
  const { error } = await useFetch(`/api/home/banner`, {
    method: 'DELETE',
    body: {
      id: id
    }
  })

  if (error.value) {
    message.show('刪除失敗!')
    return
  }

  const newImages = banners.value.concat()
  const found = newImages.find((x)=> x.id === id)
  const index = newImages.indexOf(found);
  newImages.splice(index, 1)
  banners.value = newImages
  loadingStore.hide()
}

async function sortUpdate() { 

  loadingStore.show()
  banners.value.forEach((x, i, a) => {
    a[i].sortNumber = i
  })
  const { error } = await useFetch(`/api/home/banner-sort-update`, {
    method: 'POST',
    body: {
      records: banners
    }
  })
  if (error.value) {
    message.error('連結更新失敗!')
    loadingStore.hide()
  }
  loadingStore.hide()
}

function handelFinish({ file, event }) {
  message.success('上傳成功!')
  const response = JSON.parse((event?.target).response)
  const newBanners = banners.value.concat()
  newBanners.push(response)
  banners.value = newBanners
  console.log(response, 'response',  banners.value);
}

async function beforeUploadCarouselImage(data) {
  const result = await uploadCheckImageSize(data.file.file, imageCarouselSize)
  console.log(result, 'result');
  if (!result) {
    message.error('圖片尺寸錯誤')
    return false
  }
}

// ------------------------------
// block




async function updateBlock(id, content) {
  loadingStore.show()
  const { error } = await useFetch(`/api/home/block`, {
    method: 'POST',
    body: content
  })
  if (error.value) {
    message.error('連結更新失敗!')
    loadingStore.hide()
  }

  isBlockUrlChanged[id] = false
  loadingStore.hide()
}

async function deleteBlockImage(id) {
  loadingStore.show()
  const { error } = await useFetch(`/api/home/block`, {
    method: 'DELETE',
    body: {
      id: id
    }
  })

  if (error.value) {
    message.show('刪除失敗!')
    return
  }

  const newImages = blocks.value.concat()
  const found = newImages.find((x)=> x.id === id)
  const index = newImages.indexOf(found);
  newImages.splice(index, 1)
  blocks.value = newImages
  loadingStore.hide()
}

async function sortBlockUpdate() { 

  loadingStore.show()
  blocks.value.forEach((x, i, a) => {
    a[i].sortNumber = i
  })
  const { error } = await useFetch(`/api/home/blocks-sort-update`, {
    method: 'POST',
    body: {
      records: blocks
    }
  })
  if (error.value) {
    message.error('連結更新失敗!')
    loadingStore.hide()
  }
  loadingStore.hide()
}

function handelBlockFinish({ file, event }) {
  message.success('上傳成功!')
  const response = JSON.parse((event?.target).response)
  const newBlocks = blocks.value.concat()
  newBlocks.push(response)
  blocks.value = newBlocks
}

async function beforeUploadBlockImage(data) {
  const result = await uploadCheckImageSize(data.file.file, imageBlockSize)
  console.log(result, 'result');
  if (!result) {
    message.error('圖片尺寸錯誤')
    return false
  }
}

useHead({ title: '首頁圖片輪播', })
definePageMeta({ 
  layout: 'backstage',
})

</script>

<style scoped>
.ghost {
  @apply opacity-40 border border-black rounded-md;
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
  transition: -webkit-transform 0s;
  transition: transform 0s;
  transition: transform 0s, -webkit-transform 0s;
}

</style>