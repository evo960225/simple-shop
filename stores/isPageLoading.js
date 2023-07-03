import { defineStore } from 'pinia'


export const useIsPageLoadingStore = defineStore('isPageLoading', {
  state: () => ({
    isLoading: false,
    timeLeft: 10
  }),
  actions: {
    show() {
      this.isLoading = true
      this.timer()
    },
    hide() {
      this.isLoading = false
    },
    timer() {
      this.timeLeft = 10
      let timerId = setInterval(() => {
        this.timeLeft--
        if (this.timeLeft === 0) {
          clearInterval(timerId)
          this.hide()
        }
      }, 1000);
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'isPageLoading',
        storage: process.client ? localStorage : null
      }
    ]
  }
})