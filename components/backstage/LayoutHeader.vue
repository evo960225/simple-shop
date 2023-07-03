<template>
  <div class="
    fixed px-12 <md:px-6 <sm:px-3
    grid
    <md:grid-cols-3 
    grid-cols-[1fr,minmax(max-content,1200px),1fr] 
    w-full top-0 z-50 bg-[darkcyan]"
    p="t-0 b-0"
    shadow="sm slate-700"
    backdrop="filter blur-[1px]"
  >
    <div class="flex relative min-w-[115px]">
      <div class="absolute mx-auto w-[115px]
        <md:(hidden) top-0 left-1/2 transform -translate-x-1/2
        <2xl:right-0">
        <a href="/backstage" class="logo filter">
            <img src="/logo.png" width="" height="50" alt="">
        </a>
      </div>

      <!-- <md -->
      <div class="menu-icon my-auto" :class="{open:isMenuDrawerActive}" @click="isMenuDrawerActive=!isMenuDrawerActive">
        <div class="hidden <md:block menu-icon_three-line"></div>
      </div>
    </div>

    <div class="flex justify-end items-end 2xl:w-full <xl:w-full <md:justify-center">  
      <div class="flex px-10 pt-2 pb-2 mt-0 -mb-0 ml-auto mr-0 font-semibold 
        <md:hidden"
        text="white [14px]">
        <div class="my-auto border-r-1 h-5"></div>
        <NuxtLink to="/backstage/home-editor">
          <n-button text color="#222" :focusable="false" 
            class="text-white px-3 tracking-widest text-base <lg:tracking-normal">首頁編輯</n-button>
        </NuxtLink>
        <div class="my-auto border-r-1 h-5"></div>
        <NuxtLink to="/backstage/game-editor">
          <n-button text color="#222" :focusable="false" 
            class="text-white px-3 tracking-widest text-base <lg:tracking-normal">遊戲</n-button>
        </NuxtLink>
        <div class="my-auto border-r-1 h-5"></div>
        <NuxtLink to="/backstage/product-editor">
          <n-button text color="#222" :focusable="false" 
            class="text-white px-3 tracking-widest text-base <lg:tracking-normal">商品</n-button>
        </NuxtLink>
        <div class="my-auto w-0.5 border-l-1 h-5"></div>
        <NuxtLink to="/backstage/css-editor">
          <n-button text color="#222" :focusable="false" 
            class="text-white px-3 tracking-widest text-base <lg:tracking-normal">CSS</n-button>
        </NuxtLink>
        <div class="my-auto w-0.5 border-l-1 h-5"></div>
        <div class="my-auto w-0.5 border-r-1 h-5"></div>
        <NuxtLink to="/backstage/order">
          <n-button text color="#222" :focusable="false" 
            class="text-white px-3 tracking-widest text-base <lg:tracking-normal">訂單</n-button>
        </NuxtLink>
        <div class="my-auto border-r-1 h-5"></div>
        <NuxtLink to="/backstage/storage">
          <n-button text color="#222" :focusable="false"
            class="text-white px-3 tracking-widest text-base <lg:tracking-normal">庫存</n-button>
        </NuxtLink>
        <div class="my-auto border-r-1 h-5"></div>
        <NuxtLink to="/backstage/options" class="w-full text-dark-100 tracking-widest">
          <n-button text color="#222" :focusable="false"
            class="text-white px-3 tracking-widest text-base <lg:tracking-normal">其他設定</n-button>
        </NuxtLink>
        <div class="my-auto border-r-1 h-4"></div>

        
        <div class="flex">
          <n-dropdown trigger="click" :options="userOptions" @select="handleUserOptions">
            <n-button text color="#999" class="text-white px-3 tracking-widest text-base <lg:tracking-normal" :focusable="false">
              <n-icon size="14" :component="Person"  class="" />
              <span class="ml-2">{{ managerProfile.nickname }}</span>
            </n-button>
          </n-dropdown>
          <div class="my-auto border-r-1 h-4"></div>
        </div>
      </div>
      <div class="hidden relative w-[120px] <md:flex <sm:w-100px">
        <div class="mx-auto w-[120px]">
          <a href="/" class="logo">
              <img src="/logo.png" width="299" height="91" alt="">
          </a>
        </div>
      </div>
    </div>

  </div>

  <div class="h-[70px] <md:h-[48px]"></div>
  <!-------------------------------------------------------------------------------------------------------------->

  <n-drawer id="menu" v-model:show="isMenuDrawerActive" :width="300" placement="left">
    <n-drawer-content class="flex">
      <div class="mx-auto my-2 w-full px-10" @click="isMenuDrawerActive=false">
        <ol class="text-center space-y-4 text-[16px] transition-all">
          <li>
            <NuxtLink to="/backstage/home-carousel" class="w-full text-dark-100 tracking-widest">
              <div class="w-full">首頁輪播</div>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/backstage/game-editor" class="w-full text-dark-100 tracking-widest">
              <div class="w-full">遊戲清單</div>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/backstage/product-editor" class="w-full text-dark-100 tracking-widest">
              <div class="w-full">商品清單</div>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/backstage/css-editor" class="w-full text-dark-100 tracking-widest">
              <div class="w-full">CSS</div>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/backstage/storage" class="w-full text-dark-100 tracking-widest">
              <div class="w-full">庫存</div>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/backstage/options" class="w-full text-dark-100 tracking-widest">
              <div class="w-full">其他設定</div>
            </NuxtLink>
          </li>
        </ol>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>


<script setup>
import { useI18n } from 'vue-i18n'
import { defineComponent, ref, h, computed } from 'vue'
import { NButton, NIcon, NSpace, NSwitch, NMenu, NDropdown, NBadge, NDrawer, NDrawerContent, NCard, NImage, NText } from 'naive-ui'
import { GlobeOutline, CartOutline, Person, CloseOutline } from "@vicons/ionicons5";
import { useManagerStore } from '@/stores/manager' 
import { useCartStore } from '@/stores/cart' 

const { locale, locales, setLocale, t } = useI18n({ useScope: 'global' })
const managerStore = useManagerStore()
const cartStore = useCartStore()
const managerProfile = computed(() => managerStore.profile)



const isLenguageClicked = ref(false)
const isCartDrawerActive = ref(false)
const isMenuDrawerActive = ref(false)
const cartNumber = computed(() => cartStore.count)

async function handleUserOptions(key) {
  if (key === 'logout') {
    await logout()
  } else {
    await navigateTo('/backstage/' + key)
  }
}

const languageOptions = ref(locales.value.map((x) => {
  return {
    label: x.name,
    key: x.code,
    props: {
      onClick: () => {
        setLocale(x.code)
      }
    }
  }
}))

const userOptions = [
  {
    label: '用戶資料',
    key: 'profile',
  },
  {
    label: '登出',
    key: 'logout',
  },
]


async function logout() {
  const { data } = await useFetch('/api/backstage/auth/logout', {
    method: 'POST',
  }).then(async() => {
    await managerStore.clearUserProfile()
    await navigateTo('/backstage/login')
  })
}

</script>

<style>
.n-menu.n-menu--horizontal .n-menu-item-content .n-menu-item-content-header a {
  --n-item-text-color-horizontal: #fff !important;
}

#menu li {
  @apply p-3 border-b-1 border-gray-300 transition-all;
  animation: 0.45s ease-out 0s 1 slideInFromLeft;
}
@keyframes slideInFromLeft {
  0% {
    transform: translateX(-80%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>