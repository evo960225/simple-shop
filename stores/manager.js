import { defineStore } from 'pinia'

const storeName = 'manager'
export const useManagerStore = defineStore(storeName, {
  state: () => ({
    profile: {
      id: null,
      nickname: null,
      email: null,
      loginToken: null
    }
  }),
  actions: {
    async refreshProfile() {
      const { data: managerData } = await useFetch('/api/manager/profile', { key: 'manager' + Date.now().toString() })
      this.profile = managerData.value
    },
    setProfile(profileValue) {
      if (profileValue) {
        this.profile = profileValue
      } else {
        this.profile = this.clearUserProfile()
      }
    },
   
    async clearUserProfile() {
      this.profile = {
        id: null,
        nickname: null,
        email: null,
        loginToken: null
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: storeName,
        storage: process.client ? localStorage : null
      }
    ]
  }
})