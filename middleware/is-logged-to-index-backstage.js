import { useManagerStore } from '@/stores/manager'

export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
    const useManager = useManagerStore()
    if (useManager.profile?.id) {
      console.log('to backend');
      return navigateTo('/backstage')
    }
  } 
})