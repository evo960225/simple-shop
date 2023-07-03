import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    games: [],
    products: [],
    deliveryfee: 0,
  }),
  actions: {
    async haveGame(gameId) {
      return this.games.find((x) => x.id === gameId)
    },
    async putGame(game) {
      const isFound = this.games.find((x) => x.id === game.id)
      if (isFound) return
      this.games.push(game)
    },
    async putProduct(product) {
      // 先檢查是否已經有相同商品，有的話就加數量
      const isFound = this.products.find((x) => x.id === product.id)
      if (isFound) {
        if (isFound.count + product.count > product.quantity) {
          return false
        }
        isFound.count += product.count 
        return true
      } 
      // 如果都沒有找到，這是新加入的商品，檢查數量是否超過庫存
      if (product.count > product.quantity) {
        return false
      }      
      this.products.push(product)
      return true
    },
    async clear() {
      this.games = []
      this.products = []
      this.deliveryfee = 0
    },
    isEmpty() {
      return this.games.length === 0 && this.products.length === 0
    }
  },

  getters: {
    count: (state) => {
      const productCount = state.products.reduce((t, x) => {
        return t + parseInt(x.count || 1)
      }, 0)
      const gameCount = state.games.length
      return productCount + gameCount
    },
    merchPrices: (state) => {
      const gamesPrice = state.games.reduce((t, x) => t + parseInt(x.price), 0)
      const productsPrice = state.products.reduce((t, x) => t + parseInt(x.price) * parseInt(x.count || 1), 0)
      return gamesPrice + productsPrice
    },
    deliveryPrice() {
      if (this.products.length === 0) return 0
      return this.deliveryfee
    },
    totalPrices() {
      return this.merchPrices + this.deliveryPrice
    }
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'cart',
        storage: process.client ? localStorage : null
      }
    ]
  }
})