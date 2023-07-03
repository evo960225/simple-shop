<template>
  <div class="w-4/5 max-w-[600px]">
    
    <div>
      <div class="mb-2">
        <n-button @click="createNewGame">新增</n-button>
      </div>
      <draggable
        :list="gameData"
        :disabled="!enabled"
        item-key="name"
        class="list-group"
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
          <div class="list-group-item w-full" :class="{ 'not-draggable': !enabled }">
            <n-card class="transition duration-300 transform hover:(-translate-x-1 -translate-y-1 shadow-md)">
              
              <div class="flex">
                <div>
                  <div class="w-22">
                    <img :src="`${element.imageUrl}`" class=" rounded-md" />
                  </div>
                </div>
                <div class="flex-1 items-center flex-nowrap ml-4">
                  <NuxtLink :to="`/backstage/game-editor/${element.id}`">
                    <div class="text-lg text-gray-800 font-black">{{ element.name }}</div>
                  </NuxtLink> 
                  售價： {{ element.price }}
                </div>
                <div class="flex justify-end flex-nowrap space-x-2">
                  <div class="text-blue-500">
                    <NuxtLink :to="`/backstage/game-editor/${element.id}`">編輯</NuxtLink>
                  </div>
                  <div class="text-red-500 cursor-pointer">
                    <n-botton text @click="deleteButtonHandler(element)">刪除</n-botton>
                  </div>
                </div>
              </div>
            </n-card>
          </div>
        </template>
      </draggable>
    </div>

    <n-modal
      v-model:show="showRecheckModal"
      preset="dialog"
      @positive-click="deleteGame(inquireDeleteGame.id)"
      positive-text="確定"
      negative-text="取消"
      title="警告">
      <template #header>
        <div class="font-black">你確定要刪除該遊戲嗎?</div>
      </template>
      <div class="px-8 font-bold text-md">此操作將使<span class="text-rose-500 font-black underline ">{{ inquireDeleteGame.name }}</span>的資料永久刪除!</div>
    </n-modal>

  </div>
</template>

<script setup>
import { NForm, NCard, NInput, NCheckbox, NButton, NSpace, useMessage, NSpin, NModal } from 'naive-ui';
import { CaretBack, CheckmarkCircleSharp, Close as CloseIcon, Image as ImageIcon } from "@vicons/ionicons5";
import { useUserStore } from '@/stores/user' 
import { useIsPageLoadingStore } from '@/stores/isPageLoading'
import draggable from 'vuedraggable'
const enabled =  ref(true)
const dragging = ref(false)
const msg = useMessage()
const loadingStore = useIsPageLoadingStore()
const { data: gameData } = await useFetch('/api/game')
const showRecheckModal = ref(false)
const inquireDeleteGame = ref()

async function sortUpdate(e) { 
  gameData.value.forEach((x, i, a) => {
    a[i].sortNumber = i
  })
  const { data:result, error } = await useFetch('/api/game/sort-update', { 
    method: 'POST',
    body: { 
      records: gameData.value
    }
  })
}

async function createNewGame() {
  loadingStore.show()
  const { data, error } = await useFetch('/api/game/create', { 
    method: 'POST',
  })
  if (error.value) {
    msg.error('無法新增遊戲!')
  } else {
    loadingStore.hide()
    navigateTo(`/backstage/game-editor/${data.value.id}`)
  }
  loadingStore.hide()
}

async function deleteButtonHandler(gameRecord) {
  inquireDeleteGame.value = gameRecord
  showRecheckModal.value = true
}

async function deleteGame(id) {
  loadingStore.show()
  const { data, error } = await useFetch(`/api/game/${id}`, { 
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
useHead({ title: '遊戲清單編輯'})

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
  @apply opacity-40 border-3 border-black rounded-md
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