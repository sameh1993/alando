<template>

  <section class="cart">
    <!-- components transaction info -->
    <TransactionInfo
    class="q-mb-md"
    ref="transaction_info"
    @after-getinfo="afterGetinfo"
    @change-transaction="changeTransaction"
    />

   <CartDetails
   ref="cart_details"
   :sticky_checkout="true"
   :page="page"
   :payload="['items', 'subtotal', 'distance_local', 'items_count','merchant_info']"
   @set-cartcount="setCartcount"
   @set-merchantinfo="setMerchantinfo"
   />

    <!-- components transaction info -->
  </section>

  <DeliveryDetails
  ref="delivery_details"
  @show-deliverysched="showDeliverysched"
  :transaction_data="transaction_data"
  :delivery_option="delivery_option"
  :services_list="services_list"
  />

  <DeliverySched
  ref="delivery_sched"
  @after-savetrans="afterSavetrans"
  />

</template>

<script>
import { defineAsyncComponent } from 'vue'
import APIinterface from 'src/api/APIinterface'
import { useDeliveryschedStore } from 'stores/DeliverySched'
import { usestoreAvailable } from 'stores/storeAvailable'

export default {
  name: 'CartDrawer',
  props: ['page'],
  components: {
    TransactionInfo: defineAsyncComponent(() => import('components/TransactionInfo')),
    DeliveryDetails: defineAsyncComponent(() => import('components/DeliveryDetails')),
    DeliverySched: defineAsyncComponent(() => import('components/DeliverySched')),
    CartDetails: defineAsyncComponent(() => import('components/CartDetails'))
  },
  setup () {
    const deliveryschedStore = useDeliveryschedStore()
    const ifstoreAvailable = usestoreAvailable()
    return { deliveryschedStore, ifstoreAvailable }
  },
  data () {
    return {
      transaction_data: [],
      delivery_option: [],
      services_list: [],
      merchant_info: []
    }
  },
  mounted () {
    this.deliveryschedStore.getDeliverySched(APIinterface.getStorage('cart_uuid'))
  },
  updated () {
    //
  },
  watch: {
    merchant_info (newdata, oldata) {
      this.storeAvailable()
    }
  },
  methods: {
    changeTransaction () {
      this.$refs.delivery_details.show_modal = true
    },
    showDeliverysched () {
      this.$refs.delivery_details.show_modal = false
      this.$refs.delivery_sched.show_modal = true
    },
    afterSavetrans () {
      this.$refs.transaction_info.TransactionInfo()
    },
    refreshCart () {
      this.$refs.cart_details.getCart(true)
      this.$refs.transaction_info.TransactionInfo()
    },
    setCartcount (data) {
      this.$emit('setCartcount', data)
    },
    afterGetinfo (data) {
      this.transaction_data = data.transaction_data
      this.delivery_option = data.delivery_option
      this.services_list = data.services_list
    },
    setMerchantinfo (data) {
      this.merchant_info = data
    },
    storeAvailable () {
      this.ifstoreAvailable.storeAvailable(this.merchant_info.merchant_uuid)
    }
  }
}
</script>
