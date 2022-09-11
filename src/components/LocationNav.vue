<template>
  <template v-if="hasLocalID" >
  <q-page-sticky expand position="top" >
      <q-toolbar class="bg-white location-nav">
        <template v-if="transactionStore.loading">
          <div class="row justify-center items-center full-width">
              <div class="col-xl-g col-lg-4 col-md-6 col-sm-12 col-xs-12 text-center">
                <div class="row q-col-gutter-sm-sm q-col-gutter-xs-sm q-col-gutter-md-md">
                  <div class="col-4"><q-skeleton type="rect" /></div>
                  <div class="col"><q-skeleton type="rect" /></div>
                </div>
              </div>
          </div>
        </template>
        <template v-else>
        <div class="row justify-center items-center full-width">
          <div class="col-xl-g col-lg-4 col-md-6 col-sm-12 text-center">
             <div class="row justify-center items-center">
                 <p class="q-ma-none  ellipsis transaction-width">
                   <span v-if="transactionStore.services_list[transactionStore.transaction_data.transaction_type]">
                       {{transactionStore.services_list[transactionStore.transaction_data.transaction_type].service_name}}
                     </span>

                     <span v-if="transactionStore.transaction_data.whento_deliver==='schedule'">
                       ({{transactionStore.transaction_data.delivery_datetime}})
                     </span>
                     <span v-else>
                       <template v-if="transactionStore.delivery_option[transactionStore.transaction_data.whento_deliver]">
                         ({{transactionStore.delivery_option[transactionStore.transaction_data.whento_deliver].short_name}})
                       </template>
                     </span>
                 </p>
                 <q-btn dense flat color="dark"
                 class="btn-location"
                  icon-right="keyboard_arrow_down"
                 no-caps
                 @click="changeTransaction"
                 >
                 <span class="ellipsis address-width" >{{transactionStore.transaction_data.formatted_address}}</span>
                 </q-btn>
             </div>
          </div>
        </div>
        </template>
      </q-toolbar>
    </q-page-sticky>
    <div class="q-pa-lg"></div>

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

</template>

<script>
import { defineAsyncComponent } from 'vue'
import APIinterface from 'src/api/APIinterface'
import { useTransactionStore } from 'stores/Transaction'

export default {
  name: 'LocationNav',
  components: {
    DeliveryDetails: defineAsyncComponent(() => import('components/DeliveryDetails')),
    DeliverySched: defineAsyncComponent(() => import('components/DeliverySched'))
  },
  setup () {
    const transactionStore = useTransactionStore()
    return { transactionStore }
  },
  data () {
    return {
      transaction_data: [],
      delivery_option: [],
      services_list: [],
      local_id: '',
      loading: false
    }
  },
  computed: {
    hasLocalID () {
      try {
        APIinterface.getLocalID()
        return true
      } catch (err) {
        return false
      }
    }
  },
  mounted () {
    try {
      this.local_id = APIinterface.getLocalID()
    // eslint-disable-next-line
    } catch (err) {

    }
  },
  methods: {
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
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
        })
    },
    changeTransaction () {
      this.$refs.delivery_details.show_modal = true
    },
    showDeliverysched () {
      this.$refs.delivery_details.show_modal = false
      this.$refs.delivery_sched.show_modal = true
    },
    afterSavetrans () {
      this.transactionStore.TransactionInfo()
    }
  }
}
</script>

<style lang="scss">
.address-width{
  max-width:300px
}
.transaction-width{
  max-width:200px
}
</style>
