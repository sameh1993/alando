import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    counter: 0
  }),
  actions: {
    setCartcount (data) {
      this.counter = data
    }
  }
})
