<template>

    <div v-if="transactionStore.loading" class="rounded-borders border-grey q-pa-sm" >
      <div class="row justify-start items-center ">
        <div class="col-7">
          <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
        </div>
        <div class="col"><q-skeleton type="QBtn" class="float-right" /></div>
      </div>
    </div>
    <div v-else class="rounded-borders border-grey q-pa-sm">
          <div class="row justify-start items-center ">
              <div class="col-7">
                 <div v-if="!hide_address" class="text-caption col-12 font11 text-grey line-normal">{{transactionStore.transaction_data.formatted_address}}</div>
                 <div class="text-h6 col-12 line-height-normal text-weight-bolder">
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

                   </div>
              </div>
              <div class="col">
                  <q-btn flat color="warning" no-caps class="full-width" @click="$emit('changeTransaction')"  >
                     <div class="ellipsis">Change</div>
                  </q-btn>
              </div>
          </div>
        </div>
        <!-- rounded -->

</template>

<script>
import APIinterface from 'src/api/APIinterface'
import { useTransactionStore } from 'stores/Transaction'

export default {
  name: 'TransactionInfo',
  props: ['hide_address'],
  setup () {
    const transactionStore = useTransactionStore()
    return { transactionStore }
  },
  data () {
    return {
      loading: false,
      transaction_data: [],
      delivery_option: [],
      services_list: []
    }
  },
  mounted () {
    this.TransactionInfo()
  },
  methods: {
    TransactionInfo () {
      this.transactionStore.TransactionInfo()
    }
  }
}
</script>
