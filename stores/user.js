import { defineStore } from 'pinia'

const storeName = 'user'
export const useUserStore = defineStore(storeName, {
  state: () => ({
    profile: {
      id: null,
      provider: {
        name: null,
        userId: null
      },
      nickname: null,
      avatar: null,
      email: null
    },
    refresh: null
  }),
  actions: {
    async refreshProfile() {
      const { data: userData } = await useFetch('/api/user/profile', { key: 'user' + Date.now().toString() })
      this.profile = userData.value
    },
    async setProfile(profileValue) {
      if (profileValue) {
        this.profile = profileValue
      } else {
        this.profile = {}
      }
    },
    async clearUserProfile() {
      this.profile = {
        id: null,
        provider: {
          name: null,
          userId: null
        },
        nickname: null,
        avatar: null,
        email: null,
        emailVerified: null
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