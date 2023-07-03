<template>
  <div v-if="!isAdult&&!$router.currentRoute.value.path.includes(`backstage`)">
    <div class="adult-check
      flex justify-center items-center
      fixed top-0 z-100
      backdrop-filter backdrop-blur-[12px] backdrop-contrast-115
      w-full h-full left-0
      bg-[#dcdcdc30]
      ">
      <div class="msg bg-[#fff] px-7 py-6 rounded-md absolute border-2 border-sky-200">
        <div class="min-w-[450px] <md:min-w-[300px] h-[110px]">
          <h2 class="text-xl mb-2 text-sky-600 font-semibold">這裡是作品展示網站</h2>
          <p class="text-base">
            網站內金流已關閉，僅供展示作品用途，商店內商品皆不存在，無法購買！
          </p>
        </div>
        <div class="space-x-2 flex justify-end">
          <n-button @click="checkAdult" color="#f65">我知道了</n-button>
          <!-- <n-button @click="$router.back">等我長大再來!!</n-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { defineComponent, ref, h, computed } from 'vue'
import { NButton, NDrawer, NDrawerContent, NCard, NImage, NIcon } from 'naive-ui'

const isAdult = useCookie('check_adult', { maxAge: 60 * 60 })
if (!isAdult.value) { isAdult.value = true }


function checkAdult() {
  isAdult.value = true 
}
</script>

<style scoped>
.adult-check:before {
  content: ' ';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  background-image: url('/x2.svg');
  background-repeat:repeat;
  background-size: 16px;
  animation-duration: 1.5s;
  animation-name: slidein;
}


@keyframes slidein {
  from {
    opacity:1;
    filter: blur(6px);
  }

  to {
    opacity: 0.5;
    filter: blur(0px);
  }
}

.msg {
  
  animation-duration: 0.7s;
  animation-name: blur;
}
@keyframes blur {
  from {
    filter: blur(6px);
  }

  to {
    filter: blur(0px);
  }
}
</style>
