<template>
  <div class="w-[1200px] mt-2 mb-16 <xl:(w-full p-4) <lg:-mt-0">
    <div class="flex justify-items-center mb-5 hover:opacity-70">
      <div class="flex mr-2 mt-0.5">
        <n-button text class="" @click="goBack">
          <n-icon size="24" color="#555" :component="CaretBack" class="" />
        </n-button>
      </div>
      <div class="pt-0.5 flex-grow font-black text-lg text-cool-gray-700 cursor-pointer" @click="goBack">{{ name }}</div>
    </div>
    <n-tabs type="line" animated default-value="info" class="">
      <n-tab-pane name="info" tab="產品資訊">
        <div class="flex justify-end mb-5">
          <div class="mr-1" ><n-button size="small" type="" @click="restoreContent">還原</n-button></div>
          <div><n-button size="small" type="primary" :disabled="!isChanged" @click="updateContent">更新</n-button></div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <div class="w-24">產品名稱：</div>
            <n-input v-model:value="productData.name" type="text" @input="contentChange"/>
            <n-checkbox v-model:checked="productData.isShow" class="w-36" @change="contentChange">顯示產品</n-checkbox>
          </div>
          <div  class="flex items-center">
            <div class="w-24">相關遊戲：</div>
            <n-select v-model:value="productData.gameId" :options="gameOptions" placeholder="無相關" @change="contentChange" />
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-20">價錢：</div>
            <n-input-number v-model:value="productData.price" type="text" placeholder="價錢" @input="contentChange" @change="contentChange"/>
            <div>{{ productData.currency }}</div>
          </div>
          <div class="flex items-center">
            <div class="w-24">簡介：</div>
            <n-input v-model:value="productData.introduction" type="textarea" placeholder="簡介" class="h-24"  @input="contentChange" />
          </div>
          <div class="flex items-center">
            <div class="w-24">頁面內容：</div>
            <n-input v-model:value="productData.descriptionMarkdown" type="textarea" placeholder="頁面內容"  class="h-128"  @input="contentChange" />
          </div>
          <div class="flex items-center">
            <div class="w-22">庫存：</div>
            <n-input-number v-model:value="productData.quantity" type="text" placeholder="價錢" @input="contentChange" @change="contentChange" />
          </div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="img" tab="圖片編輯">

        <div class="my-4"></div>

        <h2 class="text-lg font-black border-b-1 mb-3">輪播</h2>
        <div class="flex flex-wrap">
          <draggable
            :list="carouselImages"
            v-bind="dragOptions"
            :disabled="!draggableEnabled"
            item-key="key"
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
            <template #item="{ element: image }">
              <div class="relative w-[290px] transition-gpu group shadow shadow-sm border rounded-xl p-1 m-1 hover:opacity-70"
                  :class="draggableEnabled? 'cursor-move' : 'cursor-not-allowed'">
                <n-button text class="absolute right-2 hidden p-2 font-black text-white text-[18px] bg-rose-400 group-hover:block" @click="deleteCarouselImage(productId,image)">x</n-button>
                <img :src="`/api/public/images/product/${productId}/${image}`"  class="aspect-square object-contain" />
              </div>
            </template>
          </draggable>
          <n-spin :show="isUploadImage">
            <div class="aspect-square w-[290px] border-2 border-dashed rounded-xl border-blue-500/70 text-center">
              <n-upload 
                directory-dnd
                class="flex justify-center items-center w-full h-full" 
                method="PUT" :action="`/api/product/${productId}/carousel-img`" name="carouselImage" 
                @before-upload="beforeUploadCarousel"
                @finish="handelFinish"
              >
                <n-button class="w-full">
                  <div class="text-blue-500/70 text-xl font-bold">
                    <div>上傳檔案</div>
                  </div>
                </n-button>
                <div>({{ imageSize.width }} x {{ imageSize.height }})</div>
              </n-upload>
              <img id="uploadImage" />
            </div>
          </n-spin>
        </div>
      </n-tab-pane>
    </n-tabs>
    
  </div>
</template>
    
<script setup>
import { NInput, NInputNumber, NButton, NImage, NIcon, NCheckbox, NUpload, NSpin, NTabs, NTabPane, NSelect, useMessage, useDialog } from 'naive-ui'
import { useIsPageLoadingStore } from '@/stores/isPageLoading'
import { CaretBack, Image as ImageIcon } from "@vicons/ionicons5"
import draggable from 'vuedraggable'
const draggableEnabled =  ref(true)
const dragging = ref(false)
const message = useMessage()
const dialog = useDialog()
const imageSize = reactive({ width: 800, height: 800 })  
const loadingStore = useIsPageLoadingStore()
const isChanged = ref(false)
const route = useRoute()
const productId = route.params.slug 

const isUploadSquareHeaderImage = ref(false)
const isUploadHeaderImage = ref(false)
const isUploadImage = ref(false)

const { data: gamesData } = await useFetch(`/api/game`)
const gameOptions = gamesData.value.map((x) => {
  return {
    label: x.name,
    value: x.id
  }
})
gameOptions.splice(0, 0, {
  label: '無相關',
  value: null
})

const { data: productData } = await useFetch(`/api/product/${productId}`)

const { name } = productData.value
const carouselImages = ref(productData.value.carouselImages)
const dragOptions = ref({
  animation: 400,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
})


const restroeTmp = Object.assign({}, productData.value)


async function sortUpdate() { 
  const { data, error } = await useFetch(`/api/product/${productId}/carousel-img-sort`, { 
    method: 'POST',
    body: { sortData: carouselImages.value }
  })
  carouselImages.value = data.value.imagesName
  cacheKey.value = Date.now().toString()
}


function contentChange() {
  isChanged.value = true
}

function restoreContent() {
  productData.value = Object.assign({}, restroeTmp)
  isChanged.value = false
}

async function updateContent() {
  loadingStore.show()
  await delay(500)
  const { error } = await useFetch(`/api/product/${productId}`, {
    method: 'POST', 
    body: productData.value
  })
  if (error.value) { 
    message.error('更新失敗!')
  } else {
    message.success('更新成功!')
    isChanged.value = false
  }
  loadingStore.hide()
}

function goBack() {
  if (isChanged.value) {
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


async function beforeUploadCarousel(data) {

  if (data.file.file?.type !== 'image/png' && data.file.file?.type !== 'image/jpeg') {
    return false
  }
  
  const img = new Image()
  const imageLoading = new Promise(resolve => { 
    img.onload = function() {
      if (this.width !== imageSize.width || this.height !== imageSize.height) {
        resolve(false);
      } else {
        resolve(true);
      }
    }
  });

  img.src = URL.createObjectURL(data.file.file);
  const result = await imageLoading;
  if (!result) {
    const toleranceSize = window.confirm('圖像的長或寬尺寸錯誤。是否繼續上傳？');
    if (toleranceSize) {
      return true
    } else {
      message.error(`圖片尺寸必須為 ${imageSize.width} x ${imageSize.height}`)
      return false
    }
  }
  return true
}


function handelFinish({ file, event }) {
  message.success('上傳成功!')
  const response = JSON.parse((event?.target).response)
  const newImages = carouselImages.value.concat()
  newImages.push(response.url)
  carouselImages.value = newImages
  isUploadImage.value = false  
}

async function deleteCarouselImage(productId, fileName) {
  const { error } = await useFetch(`/api/product/${productId}/carousel-img`, {
    method: 'DELETE',
    body: {
      fileName: fileName
    }
  })
  const newImages = carouselImages.value.concat()
  const index = newImages.indexOf(fileName);
  newImages.splice(index, 1)
  carouselImages.value = newImages
}


useHead({ title: name, })
definePageMeta({ 
  layout: 'backstage',
})

</script>

<style scoped>

.product_info {
  box-shadow: #21101040 0px 4px 12px;
}

.carousel-img img {
  @apply w-full;
}
.description h3 {
  @apply px-3 py-0 mt-6 mb-2 text-large font-semibold text-sky-600 border-l-3 border-yellow-300;
}
.description p,pre {
  @apply px-12 py-3 text-black tracking-wider text-normal <md:whitespace-pre-line;
  text-align: justify;
}
.description ol {
  @apply px-12 py-3 text-black tracking-wider text-normal list-disc list-inside;
}
.buttons {
  margin-top: 35px;
}
.ghost {
  @apply opacity-40 border border-dark-500 rounded-md
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