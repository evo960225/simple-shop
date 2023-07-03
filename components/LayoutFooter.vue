<template>

  <div  class="normal_style">
    <div class="footer-menu flex py-2 w-full 

      <md:pb-4 <sm:py-6">
      <div class="w-full flex justify-center h-[24px] text-[#888] text-[12px] font-black <sm:text-center">
          <p class="m-auto tracking-widest">Copyright © {{ serviceName }} </p>
      </div>
    </div>
    
  </div>
</template>
<script setup>
const route = useRoute()
const isHome = computed(() => route.path === '/')
const runtimeConfig = useRuntimeConfig()
const { serviceName } = runtimeConfig.public

</script>

<style scoped>
.home-style .footer-menu {
  position: absolute;
  bottom: 12px;
}
.footer-menu-text {
  filter: drop-shadow(0px 4px 4px #0008);
}
.normal_style {
  background: url('/x2.svg') #fcfcfc;
  background-repeat:repeat;
  background-size: 25px;
}
</style>