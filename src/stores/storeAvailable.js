import { defineStore } from 'pinia'
import APIinterface from 'src/api/APIinterface'

export const usestoreAvailable = defineStore('storeavailable', {
  state: () => ({
    code: 2,
    messsage: '',
    loading: false
  }),

  actions: {
    storeAvailable (merchantUUID) {
      this.loading = true
      APIinterface.storeAvailable(merchantUUID)
        .then(data => {
          this.code = data.code
        })
        .catch(error => {
          this.code = 2
          this.messsage = error
        })
        .then(data => {
          this.loading = false
        })
    }
  }
})
