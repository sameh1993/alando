import { defineStore } from 'pinia'
import APIinterface from 'src/api/APIinterface'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transaction_data: [],
    delivery_option: [],
    services_list: [],
    loading: false
  }),
  actions: {
    TransactionInfo () {
      const $params = {
        cart_uuid: APIinterface.getStorage('cart_uuid'),
        local_id: APIinterface.getStorage('local_id'),
        choosen_delivery: []
      }
      this.loading = true
      APIinterface.TransactionInfo($params)
        .then(data => {
          this.transaction_data = data.details
          this.delivery_option = data.details.delivery_option
          this.services_list = data.details.services_list
        })
        .catch(error => {
          console.debug(error)
        })
        .then(data => {
          this.loading = false
        })
    }
  }
})
