import { defineStore } from 'pinia'


export const useShowErrorMessageStore = defineStore('showErrorMessage', {
  state: () => ({
    isShow: false,
    title: '錯誤',
    message: ''
  }),
  actions: {
    show(title, message) {
      this.isShow = true
      this.title = title
      this.message = message
    },
    hide() {
      this.isShow = false
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'showErrorMessage',
        storage: process.client ? localStorage : null
      }
    ]
  }
})