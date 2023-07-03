<template>
  <div class="
    fixed px-12 <md:px-6 <sm:px-3
    grid
    <md:grid-cols-3 
    grid-cols-[1fr,minmax(max-content,1200px),1fr] 
    w-full top-0 z-50 bg-[#322d]
    border-b-[8px] border-[#ddd] <sm:border-b-0
    <sm:shadow-transparent
    "
    p="t-0 b-0"
    shadow="md slate-700"
    backdrop="filter blur-[5px]"
  >
    <div class="flex relative min-w-[145px]">
      <div class="absolute mx-auto w-[145px]
        <md:(hidden)  top-1 left-1/2 transform-gpu -translate-x-1/2
        <2xl:right-0">
        <a href="/" class="logo filter">
            <img src="/logo.png" width="299" height="91" alt="">
        </a>
      </div>

      <!-- <md -->
      <div class="menu-icon my-auto" :class="{open:isMenuDrawerActive}" @click="isMenuDrawerActive=!isMenuDrawerActive">
        <div class="hidden <md:block menu-icon_three-line"></div>
      </div>
    </div>

    <div class="flex justify-end items-end 2xl:w-full <xl:w-full <md:justify-center">  
      <div class="flex px-10 pt-2 pb-2 mt-7 -mb-0 ml-auto mr-0 font-semibold bg-[#aAa968] rounded-t-2xl
        <md:hidden"
        text="white [14px]">
        <div class="my-auto border-r-1 h-5"></div>
        <NuxtLink to="/">
          <n-button text color="#222" :focusable="false" 
            class="text-white px-3 tracking-widest text-base <lg:tracking-normal">{{ t('HOME') }}</n-button>
        </NuxtLink>
        <div class="my-auto border-r-1 h-5"></div>
        <NuxtLink to="/game">
          <n-button text color="#222" :focusable="false"
            class="text-white px-3 tracking-widest text-base <lg:tracking-normal">{{ t('GAME') }}</n-button>
        </NuxtLink>
        <div class="my-auto border-r-1 h-4"></div>
        <NuxtLink to="/store">
          <n-button text color="#222" :focusable="false"
            class="text-white px-3 tracking-widest text-base <lg:tracking-normal">{{ t('SHOP') }}</n-button>
        </NuxtLink>
        <div class="my-auto border-r-1 h-4"></div>
        <!-- 募資 -->
        <!--
        <NuxtLink to="/crowdfunding">
          <n-button text color="#222" :focusable="false"
            class="text-white px-3 tracking-widest text-base <lg:tracking-normal">{{ t('CROWDFUNDING') }}</n-button>
        </NuxtLink>
        <div class="my-auto border-r-1 h-4"></div>
        -->
        <div v-if="!userProfile?.nickname" class="flex">
          <NuxtLink to="/login">
            <n-button text color="#222" :focusable="false"
              class="text-white px-3 tracking-widest text-base <lg:tracking-normal">{{ t('LOGIN') }}</n-button>
          </NuxtLink>
          <div class="my-auto border-r-1 h-4"></div>
        </div>
        <div v-else class="flex">
          <n-dropdown trigger="click" :options="userOptions" @select="handleUserOptions">
            <n-button text color="#999" class="text-white px-3 tracking-widest text-base <lg:tracking-normal" :focusable="false">
              <n-icon size="14" :component="Person"  class="" />
              <span class="ml-2">{{ userProfile.nickname }}</span>
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
    <div class="flex justify-end mt-7 ml-6 <md:(mr-0 my-auto pt-3)">

      <div class="mx-2 mb-0 self-center">
        <n-dropdown trigger="click" :options="languageOptions" @select="isLenguageClicked">
          <n-button text color="#999" :focusable="false" class="text-white" >
            <n-icon size="22" :component="GlobeOutline"  class="" />
          </n-button>
        </n-dropdown>
      </div>
      <div class="mx-1.5 mb-0 self-center">
        <n-badge :value="cartNumber" class="my-auto mb-[6px] mr-0" @click="isCartDrawerActive=!isCartDrawerActive">
          <n-button text circle color="#999"  :focusable="false" class="text-white p-1">
            <template #icon>
              <n-icon size="22" :component="CartOutline" class="hover:text-light-500" />
            </template>
          </n-button>
        </n-badge>
      </div>

    </div>
  </div>

  <div class="h-[70px] <md:h-[46px]"></div>
  <!-------------------------------------------------------------------------------------------------------------->
  <cart-drawer v-model:is-drawer-active="isCartDrawerActive"></cart-drawer>
  <n-drawer id="menu" v-model:show="isMenuDrawerActive" :width="300" placement="left">
    <n-drawer-content class="flex">
      <n-button text color="#999" class="text-[#aaa]" @click="isMenuDrawerActive=false">
        <n-icon size="24" :component="CloseOutline"  class="" />
      </n-button>
      <div class="mx-auto my-2 w-full px-10" @click="isMenuDrawerActive=false">
        <ol class="text-center space-y-4 text-[16px] transition-gpu">
          <li>
            <NuxtLink to="/" class="w-full text-dark-100 tracking-widest">
              <div class="w-full">{{ t('HOME') }}</div>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/game" class="w-full text-dark-100 tracking-widest">
              <div class="w-full">{{ t('GAME') }}</div>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/store" class="w-full text-dark-100 tracking-widest">
              <div class="w-full">{{ t('SHOP') }}</div>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/login" class="w-full text-dark-100 tracking-widest">
              <div class="w-full">{{ t('LOGIN') }}</div>
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
import { NButton, NIcon, NSpace, NSwitch, NMenu, NDropdown, NBadge, NDrawer, NDrawerContent, NCard, NImage, NText, useMessage } from 'naive-ui'
import { GlobeOutline, CartOutline, Person, CloseOutline } from "@vicons/ionicons5";
import { useUserStore } from '@/stores/user' 
import { useCartStore } from '@/stores/cart' 

const { locale, locales, setLocale, t } = useI18n({ useScope: 'global' })
const userStore = useUserStore()
const cartStore = useCartStore()

const userProfile = computed(() => userStore.profile)

const message = useMessage()

const isLenguageClicked = ref(false)
const isCartDrawerActive = ref(false)
const isMenuDrawerActive = ref(false)
const cartNumber = computed(() => cartStore.count)

async function handleUserOptions(key) {
  if (key === 'logout') {
    await logout()
  } else {
    await navigateTo('/member/' + key)
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
    label: '我的遊戲',
    key: 'my-games',
  },
  {
    label: '訂單管理',
    key: 'order-management',
  },
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
  const { data } = await useFetch('/api/auth/logout', {
    method: 'POST',
  }).then(async() => {
    userStore.clearUserProfile()
    await navigateTo('/')
    message.success('您的帳號已登出！')
  })
}

</script>

<style>
.n-menu.n-menu--horizontal .n-menu-item-content .n-menu-item-content-header a {
  --n-item-text-color-horizontal: #fff !important;
}

#menu li {
  @apply p-3 border-b-1 border-gray-300 transform-gpu transition-all;
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