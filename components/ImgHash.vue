<template>
  <img :src="urlAddHashByTime(src,60*30)" />
</template>

<script setup>
import { NButton, NDrawer, NDrawerContent, NCard, NImage, NIcon } from 'naive-ui'
const props = defineProps(['src'])
</script>
