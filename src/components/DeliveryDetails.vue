<template>
   <q-dialog v-model="show_modal" persistent>
        <q-card  class="q-pa-md" style="width: 500px; min-height: 20vw;" >

          <q-card-section class="row items-center q-pb-none">
            <q-space />
            <q-btn icon="ion-close" flat round dense v-close-popup />
          </q-card-section>

          <h5 class="text-weight-bold">Delivery details</h5>

          <q-list >
               <q-item>
              <q-item-section class="col-1"  avatar top>
                <q-icon name="place" color="black" size="20px" />
              </q-item-section>
              <q-item-section top >
                <q-item-label lines="1">
                  <span class="text-weight-medium">{{transactionStore.transaction_data.formatted_address}}</span>
                </q-item-label>
                <q-item-label caption lines="1">
                  {{transactionStore.transaction_data.address1}}
                </q-item-label>
              </q-item-section>
              <q-item-section top side>
                <q-btn
                    label="Change"
                    flat
                    color="warning"
                    class="text-weight-bold"
                    :dense="$q.screen.lt.sm"
                    v-close-popup
                    to="/location"
                    >
                    </q-btn>
              </q-item-section>
            </q-item>
            <q-item v-if="transactionStore.services_list">
              <q-item-section class="col-1"  avatar top>
                <q-icon name="schedule" color="black" size="20px" />
              </q-item-section>
              <q-item-section top >
                <q-item-label lines="1">
                  <span class="text-weight-medium" v-if="transactionStore.services_list[transactionStore.transaction_data.transaction_type]">
                    {{transactionStore.services_list[transactionStore.transaction_data.transaction_type].service_name}}
                  </span>
                </q-item-label>
                <q-item-label caption lines="1">

                   <span v-if="transactionStore.transaction_data.whento_deliver==='schedule'">
                       ({{transactionStore.transaction_data.delivery_datetime}})
                     </span>
                     <span v-else>
                       <template v-if="transactionStore.delivery_option[transactionStore.transaction_data.whento_deliver]">
                         ({{transactionStore.delivery_option[transactionStore.transaction_data.whento_deliver].short_name}})
                       </template>
                       <template v-else>
                         (Now)
                       </template>
                     </span>

                </q-item-label>
              </q-item-section>
              <q-item-section top side>
                <q-btn
                    label="Change"
                    flat
                    color="warning"
                    class="text-weight-bold"
                    :dense="$q.screen.lt.sm"
                    @click="$emit('showDeliverysched')"
                    >
                    </q-btn>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="q-mt-lg"></div>

          <q-card-actions class="">
              <q-btn
              unelevated
              rounded
              color="warning"
              text-color="black" no-caps
              class="full-width q-mb-xs"
              label="Done"
              size="17px"
              v-close-popup
              >
              </q-btn>
        </q-card-actions>

          </q-card>
     </q-dialog>

</template>

<script>
import { useTransactionStore } from 'stores/Transaction'

export default {
  name: 'DeliveryDetails',
  props: ['transaction_data', 'delivery_option', 'services_list'],
  setup () {
    const transactionStore = useTransactionStore()
    return { transactionStore }
  },
  data () {
    return {
      show_modal: false
    }
  }
}
</script>
