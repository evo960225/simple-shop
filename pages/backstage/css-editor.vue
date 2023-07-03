<template>
  <div class="w-[1200px] mt-2 mb-16 <xl:(w-full p-4) <lg:-mt-0">
    
    <h2 class="text-lg font-semibold">說明</h2>
    <div class="py-1">
      <p>此功能只能修改遊戲頁面以及商品頁面</p>
      <p><spin>遊戲頁面下方樣式</spin><spin class="m-0.5 p-0.5 border-1 bg-light-300 rounded-md">.description.description-game { }</spin></p>
      <p><spin>商品頁面下方樣式</spin><spin class="m-0.5 p-0.5 border-1 bg-light-300 rounded-md">.description.description-product { }</spin></p>
      <p>如果修改沒反應，可以考慮用<mark>!important</mark></p>

    </div>
    <div class="flex justify-end mb-5">
      <div class="mr-1"><n-button size="small" type="" @click="restoreContent">還原</n-button></div>
      <div><n-button size="small" type="primary" :disabled="!isChanged" @click="updateContent">更新</n-button></div>
    </div>
    <div class="space-y-2">
      <div class="flex items-center">
        <n-input v-model:value="cssContent" type="textarea" placeholder=".description.description-game p { font-size:16px;  }" class="h-120" @input="contentChange" />
      </div>
    </div>


    
  </div>
</template>
    
<script setup>
import { NInput, NInputNumber, NButton, NImage, NIcon, NCheckbox, NUpload, NSpin, NTabs, NTabPane, NPopover, useMessage, useDialog } from 'naive-ui'
import { useIsPageLoadingStore } from '@/stores/isPageLoading'
import { CaretBack, Image as ImageIcon, Close, ArrowDownOutline, HelpCircleOutline } from "@vicons/ionicons5";
import draggable from 'vuedraggable'

const isLoading = ref(false)
const message = useMessage()
const dialog = useDialog()
const loadingStore = useIsPageLoadingStore()
const isChanged = ref(false)
const route = useRoute()


const { data: cssContent } = await useFetch(`/api/public/styles/description`)
const restroeTmp = (' ' + cssContent.value).slice(1);


function contentChange() {
  isChanged.value = true
}
function restoreContent() {
  cssContent.value = (' ' + restroeTmp).slice(1)
  isChanged.value = false
}

async function updateContent() {
  loadingStore.show()
  await delay(500)
  const { data, error } = await useFetch(`/api/styles/update-description-css`, {
    method: 'POST', 
    body: { cssContent: cssContent.value }
  })
  if (error.value) { 
    message.error('更新失敗!')
  } else {
    message.success('更新成功!')
    isChanged.value = false
  }
  cssContent.value = data.value.cssContent
  loadingStore.hide()
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

mark {
  @apply bg-yellow-100 rounded-md border-1 border-light-500 p-0.5;
}
</style>