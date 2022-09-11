<template>
   <q-dialog v-model="show_modal" persistent transition-show="scale" transition-hide="scale"
   @before-show="beforeShow"
    >
      <q-card class="q-pa-md" style="width: 550px; max-width: 80vw;" >
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="ion-close" flat round dense v-close-popup />
        </q-card-section>

        <NewAddress
        ref="new_address"
        :show_cancel="false"
        @after-confirmlocation="afterConfirmlocation"
        @after-selectaddress="afterSelectaddress"
        />

      </q-card>
   </q-dialog>

    <AddressDetails
    ref="address_details"
    :locationdata="location_data"
    :maps_config="maps_config"
    @after-saveaddress="afterSaveaddress"
    />

</template>

<script>
import { defineAsyncComponent } from 'vue'
import APIinterface from 'src/api/APIinterface'

export default {
  name: 'AddressModal',
  components: {
    NewAddress: defineAsyncComponent(() => import('components/NewAddress')),
    AddressDetails: defineAsyncComponent(() => import('components/AddressDetails'))
  },
  data () {
    return {
      show_modal: false,
      maps_config: [],
      location_data: []
    }
  },
  methods: {
    afterConfirmlocation (data, config) {
      this.location_data = data
      this.maps_config = config
      this.$refs.address_details.show_modal = true
      this.show_modal = false
    },
    afterSaveaddress () {
      this.$emit('afterSaveaddress')
    }
  }
}
</script>
