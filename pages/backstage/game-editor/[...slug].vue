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

    <!-- # tab -->
    <n-tabs type="line" animated default-value="info" class="">
      <!-- 遊戲資訊 -->
      <n-tab-pane name="info" tab="遊戲資訊">
        <div class="flex justify-end mb-5">
          <div class="mr-1"><n-button size="small" type="" @click="restoreContent">還原</n-button></div>
          <div><n-button size="small" type="primary" :disabled="!isChanged" @click="updateContent">更新</n-button></div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <div class="w-24">遊戲名稱：</div>
            <n-input v-model:value="gameData.name" type="text" @input="contentChange"/>
            <n-checkbox v-model:checked="gameData.isShow" class="w-36" @change="contentChange">顯示遊戲</n-checkbox>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-20">價錢：</div>
            <n-input-number v-model:value="gameData.price" type="text" placeholder="價錢" @input="contentChange"/>
            <div>{{ gameData.currency }}</div>
          </div>
          <div class="flex items-center">
            <div class="w-24">簡介：</div>
            <n-input v-model:value="gameData.introduction" type="textarea" placeholder="簡介" class="h-24" @input="contentChange" />
          </div>
          <div class="flex items-center">
            <div class="w-24">頁面內容：</div>
            <n-input v-model:value="gameData.descriptionMarkdown" type="textarea" placeholder="頁面內容" class="h-128" @input="contentChange" />
          </div>
          <div class="flex items-center">
            <div class="w-24">Steam連結：</div>
            <n-input v-model:value="gameData.steamLink" type="text" placeholder="Steam連結"  @input="contentChange" />
          </div>
      </div>
      </n-tab-pane>

      <!-- 圖片編輯 -->
      <n-tab-pane name="img" tab="圖片編輯">
        <div class="my-4"></div>

        <h2 class="text-lg font-black border-b-1 mb-3">標題圖片</h2>
        <div class="flex space-x-4">
          <div class="relative group transition-all">
            <n-upload class="h-full"
              method="POST" :action="`/api/game/${gameId}/upload-square-header`" name="file"  
              @before-upload="beforeUploadSquare"
              @finish="finishUploadSquare"
            >
              <img :src="gameData.imageUrl"
                class="rounded-md transition w-60 h-60 cursor-pointer bg-light-500 group-hover:(opacity-60)" 
              />
              <div class="absolute top-1/2 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2 hidden group-hover:block">
                <n-button text class="flex mx-auto text-center font-black  text-[36px]">
                  <n-icon color="#333" :component="ImageIcon"></n-icon>
                </n-button>
                <div class="text-lg text-black">({{ imageSquareSize.width }} x {{ imageSquareSize.height }})</div>
              </div>
             
            </n-upload>
            
          </div>
          <div class="relative group transition-all">
            <n-upload class="min-w-23 min-h-8 bg-light-500" 
              method="POST" :action="`/api/game/${gameId}/upload-header`" name="file"  
              @before-upload="beforeUploadHeaderImage"
              @finish="finishUploadHeader"
            >
              <img :src="gameData.headerImageUrl"  
                class="w-120 h-60 rounded-md transition cursor-pointer group-hover:(opacity-60)"
              />
              <div class="absolute top-1/2 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2 hidden group-hover:block">
                <n-button text class="flex mx-auto text-center font-black  text-[36px]">
                  <n-icon color="#333" :component="ImageIcon"></n-icon>
                </n-button>
                <div class="text-lg text-black">({{ imageHeaderSize.width }} x {{ imageHeaderSize.height }})</div>
              </div>
            </n-upload>
          </div>
        </div>

        <div class="my-8"></div>

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
            @change="sortCarouselImage"
            :component-data="{
              tag: 'ul',
              type: 'transition-group',
              name: !dragging ? 'flip-list' : null
            }"
          >
            <template #item="{ element: image }">
              <div class="relative w-[290px] transition-all group hover:opacity-70" 
                  :class="draggableEnabled? 'cursor-move' : 'cursor-not-allowed'">
                <n-button text class="absolute right-2 hidden p-2 font-black text-white text-[18px] bg-rose-400 group-hover:block" @click="deleteCarouselImage(gameId,image)">
                  x
                </n-button>
                <img :src="`/api/public/images/game/${gameId}/carousel/${image}`" />
              </div>
            </template>
          </draggable>

          <n-spin :show="isUploadImage">
            <div class="aspect-[16/9] w-[290px] h-40 border-2 border-dashed border-blue-500/70 text-center">
              <n-upload 
                class="flex justify-center items-center w-full h-full" 
                method="PUT" :action="`/api/game/${gameId}/carousel-img`" name="carouselImage" 
                @before-upload="beforeUploadCarouselImage"
                @finish="handelFinish" 
              >
                <n-button class="w-full text-blue-500/70">
                  <div class="text-blue-500/70 text-xl font-bold">
                    <div>上傳檔案</div>
                  </div>
                </n-button>
                <div>({{ imageCarouselSize.width }} x {{ imageCarouselSize.height }})</div>
              </n-upload>
              <img id="uploadImage"  />
            </div>
          </n-spin>
        </div>
      </n-tab-pane>

      <!-- 上傳遊戲 -->
      <n-tab-pane name="game" tab="上傳遊戲">
   
        <n-upload
          method="POST" :action="`/api/game/${gameId}/upload-game`" name="gameFile" :headers="{'chunkIndex': 0}"
          @before-upload="isUploadFile=true"
          @error="message.error('上傳失敗')"
          @finish="uploadGameFinish"
        >
          <n-button :loading="isUploadFile" :disable="isUploadFile">上傳檔案</n-button>
        </n-upload>
        <div class="p-3 shadow-sm w-[400px] border-1">
          <div>
            檔案超過100MB時，請使用bat檔案上傳。
          </div>
          <div class="flex items-center">
            <a :href="`/api/game/${gameId}/upload-bat-file`">
              <n-button>使用bat檔上傳</n-button>
            </a>
            <n-popover trigger="hover">
              <template #trigger>
                <n-icon :component="HelpCircleOutline" class="ml-1 text-[18px] text-gray-500"></n-icon>
              </template>
              <span>使用方式：先下載bat檔案，將檔案拉進bat圖示後輸入密碼，它將會把檔案上傳。</span>
            </n-popover>
          </div>
        </div>
        <div class="my-4 border-b "></div>
        <div>列表</div>
        <div v-for="{fileName, updated} in gameFilesData" 
          class="flex items-center justify-between shadow-sm px-1.5 py-1.5 my-1 border border-light-700 max-w-110"
        >
          <div class="px-2">{{ fileName }}</div>
          <div class="text-true-gray-400 ml-auto mr-2"> {{ new Date(updated).toLocaleString() }} </div>
  
          <a :href="`/api/game/${gameId}/download/${fileName}`" >
            <div class="flex mx-0.5 hover:text-green-600 transition duration-200">
              <n-icon :component="ArrowDownOutline" class="text-16px"></n-icon>
            </div>
          </a>
          <n-button text size="small" @click="deleteFile(fileName)" class="mx-0.5">
            <template #icon>
              <n-icon :component="Close" class=""></n-icon>
            </template>
          </n-button>
        </div>

      </n-tab-pane>

      <!-- 上傳公開檔案 -->
      <n-tab-pane name="public-game" tab="上傳公開檔案">
    
        <n-upload
          method="POST" :action="`/api/game/${gameId}/upload-public-game-file`" name="gameFile" :headers="{'chunkIndex': 0}"
          @before-upload="isUploadFile=true"
          @error="message.error('上傳失敗')"
          @finish="uploadPublicGameFinish"
        >
          <n-button :loading="isUploadFile" :disable="isUploadFile">上傳檔案</n-button>
        </n-upload>
        <div class="p-3 shadow-sm w-[400px] border-1">
          <div>
            檔案超過100MB時，請使用bat檔案上傳。
          </div>
          <div class="flex items-center">
            <a :href="`/api/game/${gameId}/upload-bat-public-file`">
              <n-button>使用bat檔上傳</n-button>
            </a>
            <n-popover trigger="hover">
              <template #trigger>
                <n-icon :component="HelpCircleOutline" class="ml-1 text-[18px] text-gray-500"></n-icon>
              </template>
              <span>使用方式：先下載bat檔案，將檔案拉進bat圖示後輸入密碼，它將會把檔案上傳。</span>
            </n-popover>
          </div>
        </div>
        <div class="my-4 border-b "></div>
        <div>列表</div>
        <div v-for="{fileName, updated} in gamePublicFilesData" 
          class="flex items-center justify-between shadow-sm px-1.5 py-1.5 my-1 border border-light-700 max-w-110"
        >
          <div class="px-2">{{ fileName }}</div>
          <div class="text-true-gray-400 ml-auto mr-2"> {{ new Date(updated).toLocaleString() }} </div>

          <a :href="`/api/game/${gameId}/download/public/${fileName}`" >
            <div class="flex mx-0.5 hover:text-green-600 transition duration-200">
              <n-icon :component="ArrowDownOutline" class="text-16px"></n-icon>
            </div>
          </a>
          <n-button text size="small" @click="deletePublicFile(fileName)" class="mx-0.5">
            <template #icon>
              <n-icon :component="Close" class=""></n-icon>
            </template>
          </n-button>
        </div>

      </n-tab-pane>


    </n-tabs>

    
  </div>
</template>
    
<script setup>
import { NInput, NInputNumber, NButton, NImage, NIcon, NCheckbox, NUpload, NSpin, NTabs, NTabPane, NPopover, useMessage, useDialog } from 'naive-ui'
import { useIsPageLoadingStore } from '@/stores/isPageLoading'
import { CaretBack, Image as ImageIcon, Close, ArrowDownOutline, HelpCircleOutline } from "@vicons/ionicons5";
import draggable from 'vuedraggable'

const isLoading = ref(false)
const isUploadFile = ref(false)
const draggableEnabled =  ref(true)
const dragging = ref(false)
const message = useMessage()
const dialog = useDialog()
const loadingStore = useIsPageLoadingStore()
const isChanged = ref(false)
const route = useRoute()
const gameId = route.params.slug 
const imageSquareSize = { width: 800, height: 800 }  
const imageHeaderSize = { width: 460, height: 215 }
const imageCarouselSize = { width: 1600, height: 900 }

const isUploadSquareHeaderImage = ref(false)
const isUploadHeaderImage = ref(false)
const isUploadImage = ref(false)

const cacheKey = ref(new Date().toString())
const { data: gameData } = await useFetch(`/api/game/${gameId}`)
const { data: gameFilesData } = await useFetch(`/api/game/${gameId}/game-files-info`)
const { data: gamePublicFilesData } = await useFetch(`/api/game/${gameId}/game-public-files-info`)

const { name } = gameData.value
const carouselImages = ref(gameData.value.carouselImages)
const restroeTmp = Object.assign({}, gameData.value)
const dragOptions = ref({
  animation: 400,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
})


function contentChange() {
  isChanged.value = true
}
function restoreContent() {
  gameData.value = Object.assign({}, restroeTmp)
  isChanged.value = false
}

async function updateContent() {
  loadingStore.show()
  await delay(500)
  const { error } = await useFetch(`/api/game/${gameId}`, {
    method: 'POST', 
    body: gameData.value
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


async function finishUploadHeader({ file, event }) {
  message.success('上傳成功!')
  const response = JSON.parse((event?.target).response)
  gameData.value.headerImageUrl = response.url
  // #
  isUploadImage.value = false  
  isUploadHeaderImage.value = false
}

async function finishUploadSquare({ file, event }) {
  message.success('上傳成功!')
  const response = JSON.parse((event?.target).response)
  gameData.value.imageUrl = response.url
  // #
  isUploadImage.value = false  
  isUploadSquareHeaderImage.value = false
}


function handelFinish({ file, event }) {
  message.success('上傳成功!')
  const response = JSON.parse((event?.target).response)
  const newImages = carouselImages.value.concat()
  newImages.push(response.url)
  carouselImages.value = newImages
  isUploadImage.value = false  
}




async function deleteCarouselImage(gameId, fileName) {
  
  const { error } = await useFetch(`/api/game/${gameId}/carousel-img`, {
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

async function sortCarouselImage() {
  draggableEnabled.value = false
  const { data, error } = await useFetch(`/api/game/${gameId}/carousel-img-sort`, {
    method: 'POST',
    body: { sortData: carouselImages.value }
  })
  carouselImages.value = data.value.imagesName
  draggableEnabled.value = true
}


// gmae file
async function uploadGameFinish({ file, event }) {
  isUploadFile.value = false
  const response = JSON.parse((event?.target).response)
  gameFilesData.value = response
  message.success('上傳成功!')
}

async function deleteFile(fileName) {
  const { data, error } = await useFetch(`/api/game/${gameId}/game-file`, {
    method: 'DELETE',
    body: {
      fileName: fileName
    }
  })
  if (error.value) {
    message.error('刪除失敗!')
    return
  }

  gameFilesData.value = data.value
  message.success('刪除成功!')
}

// 公開檔案
async function uploadPublicGameFinish({ file, event }) {
  isUploadFile.value = false
  const response = JSON.parse((event?.target).response)
  gamePublicFilesData.value = response
  message.success('上傳成功!')
}

async function deletePublicFile(fileName) {
  const { data, error } = await useFetch(`/api/game/${gameId}/game-public-file`, {
    method: 'DELETE',
    body: {
      fileName: fileName
    }
  })
  if (error.value) {
    message.error('刪除失敗!')
    return
  }

  gamePublicFilesData.value = data.value
  message.success('刪除成功!')
}



async function beforeUploadSquare(data) {
  isUploadSquareHeaderImage.value = true
  await uploadCheckImageSize(data.file.file, imageSquareSize)
}

async function beforeUploadHeaderImage(data) {
  isUploadHeaderImage.value = true
  await uploadCheckImageSize(data.file.file, imageHeaderSize)
}

async function beforeUploadCarouselImage(data) {
  await uploadCheckImageSize(data.file.file, imageCarouselSize)
}


useHead({ title: name, })
definePageMeta({ 
  layout: 'backstage',
})

</script>

<style scoped>

.game_info{
  box-shadow: #21101040 0px 4px 12px;
}

.carousel {
  aspect-ratio: 180 / 101;
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

/* draggable */
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