<template>

  <div class="home ">
    <div class="w-full mx-auto">

      <!---- carousel ---->
      <div class="flex relative h-[633px] <xl:(max-h-[633px] h-auto rounded-none)" >
        <n-carousel
          dot-type="line"
          dot-placement="bottom"
          autoplay    
          :interval="5000"
          effect="slide"
          draggable
          v-model:current-index="carouselCurrentIndex"
          class="z-1 carousel w-full m-auto "
        >
          <div v-for="(data, index) in bannerData" 
            class="max-w-[1400px] mx-auto <xl:(w-full h-auto)" 
            :class="{'shadow-md shadow-gray-500': isLoaded}">
            <NuxtLink :to="data.hyperLink" class="h-auto">
              <img v-if="index===0" 
                class="carousel-img animated-element max-h-full max-w-full" :src="data.imageUrl">
              <img v-else
                class="carousel-img max-h-full max-w-full" v-lazyload="data.imageUrl" loading="lazy">
            </NuxtLink>
          </div>
        </n-carousel>
        
        <div class="absolute overflow-hidden w-full h-full transition-all transform-gpu duration-0" :class="{'transition-none duration-0 opacity-0': isAnimating}">
          <div class="absolute w-full h-full transform scale-130" style="filter:opacity(60%) saturate(0.8) blur(12px) ; z-index:-1;">
            <img class="max-h-full w-full object-cover" :src="bannerData[carouselCurrentIndex]?.imageUrl" loading="lazy" />
          </div>
          <div class="absolute w-full h-full transform scale-130" style="filter:opacity(65%) contrast(1.8) saturate(0.7) blur(4px) ; z-index:-1;">
            <img class="max-h-full w-full object-cover" :src="bannerData[carouselCurrentIndex]?.imageUrl" loading="lazy" />
          </div>
        </div>

        <!-- pre -->
        <div class="absolute overflow-hidden w-full h-full transition-all transform-gpu opacity-0 duration-500" :class="{'transition-none duration-0 opacity-100': isAnimating}">
          <div class="absolute w-full h-full transform scale-130" style="filter:opacity(60%) saturate(0.8) blur(12px) ; z-index:-1;">
            <img class="max-h-full w-full object-cover" :src="bannerData[tempPreIndex]?.imageUrl" loading="lazy" />
          </div>
          <div class="absolute w-full h-full transform scale-130" style="filter:opacity(65%) contrast(1.8) saturate(0.7) blur(4px) ; z-index:-2;">
            <img class="max-h-full w-full object-cover" :src="bannerData[tempPreIndex]?.imageUrl" loading="lazy" />
          </div>
        </div>


      </div>

      <!---- middle content ---->
      <div class="relative w-full">

        <!-- games -->
        <div class="w-screen overflow-x-hidden bg-[#f1f1f1]">
          <div class="flex pt-3 mb-2 mx-auto overflow-x-scroll scrollbar-hide
                      2xl:(w-full justify-center) <sm:(mt-0 mb-0)">
            <div v-for="block in blocksData" 
              class="p-2">
              <NuxtLink :to="block.hyperLink" class="">
                <div class="w-64 <lg:w-48 <md:w-32">
                  <img class="transform-gpu transition-all duration-200 ease-in-out hover:opacity-60" :src="block.imageUrl" alt="遊戲圖片" />
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <!---- HR --->


        <!---- store fb ---->
        <div class="flex justify-center justify-items-center mx-auto mt-16 mb-24 
          <md:(flex-wrap mt-4 mb-8)
          2xl:w-[1200px] 
          <xl:(w-full p-2 flex-col)
        ">
          <div class="w-full mr-8 <xl:(w-4/5  mx-auto)  <md:(w-full px-0.5)">
            <h2 class="pl-6 pt-2.5 pb-1 mb-2 text-2xl font-black border-b-5 border-[#F487CD] <sm:text-xl">
              熱門商品
            </h2>

            <div class="grid grid-cols-3 grid-rows-2 gap-2  <xl:(grid-cols-2) <sm:(gap-x-0.5 gap-y-8)">
              <div v-for="product in hotProducts">
                <div class="group p-1 ">
                  
                  <nuxt-link :to="`/store/${product.id}`">
                    <div class="relative overflow-hidden aspect-square min-h-[250px] min-w-[250px] 
                      border-1 border-gray-300 transition duration-250 group-hover:opacity-70
                    ">
                      <div class="absolute
                        transform -rotate-45 bg-[#F487CD] text-lg font-black text-white pt-6 px-8 -top-3 -left-9
                        <sm:(text-[12px] -top-1 -left-6.5 pt-3 px-6 pb-0.5)">HOT</div>
                      <img v-lazyload="product.imageUrl" class="p-2 "  />
                    </div>
                    <p class="font-black text-gray-600 group-hover:text-[#BAB1FC] <sm:(text-sm)">{{ product.name }}</p>
                    <p class="text-red-500/80 font-black <sm:(text-sm)">{{ `售價：${ product.price }元` }}</p>
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div class="flex justify-center items-center">
              <nuxt-link to="/store">
                <button class="min-w-72 w-1/2 
                  py-3 border-2 border-[#BAD1FC]
                  transition duration-200 filter
                  hover:(bg-[#BAD1FC] text-white)
                  mt-10
                  <xl:mt-6">
                  more
                </button>
              </nuxt-link>
            </div>
          </div>


          <div class="w-[430px]  
            <xl:(w-4/5 mx-auto mt-16)  
            <md:(w-full px-2)">
            <div class="bg-[#BAD1FC] rounded-tr-[40px]">
              <h3 class="text-2xl text-white font-extrabold border-b-5 border-white pl-6 pb-1 pt-2.5 w-72">
                Facebook
              </h3>
              <div class="mx-auto pt-4 px-6 justify-center justify-items-center <sm:px-0">
                <div class="">
                  <div class="flex justify-center items-center w-full">
                    <div class="<xl:hidden <sm:block flex">
                      <div class="fb-page" data-href="https://www.facebook.com/lonely.fei.zhai" 
                        data-tabs="timeline" 
                        data-width="300" data-height="500" 
                        data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" 
                        data-show-facepile="true">
   

                      </div>
                    </div>
                    <div class="hidden <xl:block <sm:hidden">
                      <div class="fb-page" data-href="https://www.facebook.com/lonely.fei.zhai" 
                        data-tabs="timeline" 
                        data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" 
                        data-show-facepile="true">
              
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            
  
            </div>

          </div>
        </div>
      </div>
  

     
    </div>
  </div>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import { NButton, NCarousel, NGrid, NGi, NCard } from 'naive-ui'
const runtimeConfig = useRuntimeConfig()
const isLoaded = ref(false)

const { data: hotProducts } = await useFetch(`/api/product/hot`, { 
  method: 'GET',  
  key: 'hot-products' + Date.now().toString()
})
if (!hotProducts.value) hotProducts.value = []
const { data: bannerData } = await useFetch(`/api/home/banners`, { method: 'GET' })
if (!bannerData.value) bannerData.value = []
const { data: blocksData } = await useFetch(`/api/home/blocks`, { method: 'GET' })
if (!blocksData.value) blocksData.value = []
const carouselCurrentIndex = ref(0)
const isAnimating = ref(false)
const tempPreIndex = ref(0)
const fbUrl = runtimeConfig.public.fbUrl


watch(carouselCurrentIndex, (val, prevVal) => {
  if (val === prevVal) return
  isAnimating.value = true
  tempPreIndex.value = prevVal
  setTimeout(() => {
    isAnimating.value = false
  }, 50)

}, { immediate: true })


onMounted(async() => {
  isLoaded.value = true
})

// change image url to 500px
hotProducts.value.forEach((x, i, a) => {
  // get base url
  const arrUrl = x.imageUrl.split('/')
  const baseUrl = arrUrl.slice(0, -1).join('/')
  const fileName = arrUrl.pop()
  const smallFileName = fileName.split('.')[0] + '-x500.jpg'
  a[i].imageUrl = `${baseUrl}/small/${smallFileName}`
  
})
console.log(hotProducts.value);
useHead({
  script: [{ 
    async: true,  defer: true, crossorigin: 'anonymous', 
    src: 'https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v17.0&appId=940057670581287&autoLogAppEvents=1', nonce: 'd0hZLdNq'
  }],
});


</script>


<style scoped>

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel {
  aspect-ratio: 160 / 76;
}

.company_info {
  background-image: url('/images/.png');
  background-repeat: no-repeat;
  height: 605px;
  background-size: cover;
  background-position: center;
  @apply <xl:h-[400px] <lg:h-[350px];
}
.news_card-left {
  box-shadow: 15px 15px 0px #7B98D8;
  border-bottom-right-radius: 100px 100px;
}
.news_card-right {
  box-shadow: 15px 15px 0px #ADD2EB;
  border-top-left-radius: 50px 50px;
  border-bottom-right-radius: 50px 50px;
}

.divide-black {
  opacity: 0.9;
  background-image: url('/images/首頁底圖-02.png');
  background-repeat: no-repeat;
  background-size: 280px;
}
.divide-black-blue {
  opacity: 0.9;
  background-image: url('/images/首頁底圖-01.png');
  background-repeat: no-repeat;
  background-size: 280px;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    filter: blur(3px);
  }
  100% {
    opacity: 1;
    filter: blur(0px);
  }
}

.animated-element {
  animation-duration: 0.5s;
  animation-name: fadeIn;
}


</style>
<style>
.n-carousel.n-carousel--card .n-carousel__slide.n-carousel__slide--next {
  opacity: 1 !important;
}


</style>