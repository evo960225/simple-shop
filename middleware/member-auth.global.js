import { useUserStore } from '@/stores/user'
import { useMessage } from 'naive-ui'
export default defineNuxtRouteMiddleware(async(to, from) => {
  if (process.client) {
    const [_, folderName] = to.path.split('/')
    const userStore = useUserStore()
    if (folderName === 'member' || folderName === 'checkout') {
      if (!userStore.profile?.id) {
        return await navigateTo('/login?member=0') 
      } 
    }
    // 功能暫時失去
    // if (folderName === 'checkout') {
    //   if (!userStore.profile?.emailVerified) {
    //     return await navigateTo('/member/email-verify') 
    //   } 
    // }
  } 
})

