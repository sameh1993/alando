<template>
 <q-dialog v-model="show_modal" persistent transition-show="scale" transition-hide="scale" >
      <q-card class="q-pa-md" style="width: 500px; max-width: 80vw;" >
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

         <q-card-section>
         <q-btn-toggle
          v-model="schedStore.transaction_type"
          toggle-color="warning"
          no-caps
          unelevated
          class="rounded-group"
          :options="schedStore.transaction_list"
        />

        <p class="q-pt-md q-pb-none">Choose delivery time</p>

         <q-option-group
          v-model="whento_deliver"
          :options="schedStore.delivery_options"
          color="warning"
          @update:model-value="chooseWhen"
        />

         <div class="q-mt-md" v-if="whento_deliver==='schedule'">
          <q-select outlined dense v-model="schedStore.delivery_date"
            color="warning"
            class="q-mb-md"
            transition-show="scale"
            transition-hide="scale"
            :options="schedStore.delivery_date_list"
            emit-value
            map-options
            @update:model-value="chooseDate"
          />
          <q-select outlined dense v-model="schedStore.delivery_time"
            color="warning"
            class="q-mb-md"
            transition-show="scale"
            transition-hide="scale"
            :options="schedStore.delivery_time_list"
          />
        </div>
        </q-card-section>

         <q-card-actions class="">
              <q-btn
              unelevated
              rounded
              color="warning"
              text-color="black" no-caps
              class="full-width q-mb-md"
              label="Save"
              size="17px"
              @click="saveTransactionInfo"
              :loading="schedStore.loading"
              >
              </q-btn>
        </q-card-actions>

      </q-card>
  </q-dialog>

</template>

<script>
import APIinterface from 'src/api/APIinterface'
import { useDeliveryschedStore } from 'stores/DeliverySched'

const $openingHours = []
const $openingDates = []

export default {
  name: 'DeliverySched',
  setup () {
    const schedStore = useDeliveryschedStore()
    return { schedStore }
  },
  data () {
    return {
      show_modal: false,
      loading: false,
      transaction_type: '',
      transaction_list: [],
      whento_deliver: 'now',
      delivery_date: '',
      delivery_time: '',
      delivery_options: [],
      delivery_date_list: [],
      delivery_time_list: [],
      opening_hours: [],
      trans_data: []
    }
  },
  methods: {
    showSched (data) {
      this.show_modal = data
    },
    chooseWhen (data) {
      if (data === 'schedule') {
        this.schedStore.getDeliveryTimes()
      }
    },
    chooseDate (data) {
      this.schedStore.delivery_time_list = []
      this.schedStore.delivery_time = ''
      this.schedStore.getTimeList(data)
    },
    saveTransactionInfo () {
      this.schedStore.loading = true
      const cartUUID = APIinterface.getStorage('cart_uuid')
      const $params = {
        cart_uuid: cartUUID,
        delivery_date: this.schedStore.delivery_date,
        whento_deliver: this.whento_deliver,
        delivery_time: this.schedStore.delivery_time,
        transaction_type: this.schedStore.transaction_type
      }
      APIinterface.saveTransactionInfo($params)
        .then(data => {
          if (APIinterface.empty(cartUUID)) {
            APIinterface.setStorage('cart_uuid', data.details.cart_uuid)
          }

          const $data = {
            whento_deliver: this.whento_deliver,
            delivery_date: this.delivery_date,
            delivery_time: this.delivery_time
          }
          this.$emit('afterSavetrans', $data)

          APIinterface.setStorage('delivery_sched', 1)

          this.show_modal = false
          if (this.$route.path === '/location') {
            this.$router.push({ name: 'menu', params: { addcart: true } })
          }
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'warning', this.$q)
        })
        .then(data => {
          this.schedStore.loading = false
        })
    }
  }
}
</script>
