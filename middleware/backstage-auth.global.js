import { useManagerStore } from '@/stores/manager'

export default defineNuxtRouteMiddleware(async(to, from)  => {
  if (process.client) { 
    const ls_dir = to.path.split('/')

    if (ls_dir[1] === 'backstage') {

      const managerStore = useManagerStore()
      console.log('bs middle');
      console.log(to.path, ls_dir, managerStore.profile);

      // 前往login但已登入
      if (to.path === '/backstage/login') {
        if (managerStore.profile && managerStore.profile.id) {
          return await navigateTo('/backstage') 
        } 
      }
      // 前往後台但未登入
      else {
        if (!managerStore.profile || !managerStore.profile.id) {
          console.log('to login', managerStore.profile);
          return await navigateTo('/backstage/login') 
        } 
      }
    }
  }
})