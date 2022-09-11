<template>
  <q-dialog v-model="show_modal" persistent >
      <q-card  class="q-pa-md" style="width: 500px; min-height: 20vw;" >

         <q-card-section class="row items-center q-pb-none  no-margin no-padding">
            <q-space />
            <q-btn icon="ion-close" flat round dense v-close-popup />
          </q-card-section>

        <SearchLocation
        ref="search_location"
        :detect_location="false"
        :label_id="2"
        class_name=""
        @after-selectaddress="afterSelectaddress"
        />

        <q-card-section  style="max-height: 50vh" class="scroll">
        <AddressQuickList
        @fill-address="fillAddress"
        @after-deleteaddress="afterDeleteaddress"
        @after-setplaceid="afterSetplaceid"
        />
        </q-card-section>

      </q-card>
 </q-dialog>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  name: 'LocationModal',
  components: {
    SearchLocation: defineAsyncComponent(() => import('components/SearchLocation')),
    AddressQuickList: defineAsyncComponent(() => import('components/AddressQuickList'))
  },
  data () {
    return {
      show_modal: false
    }
  },
  methods: {
    afterSelectaddress (data) {
      this.$emit('afterSelectaddress', data)
    },
    fillAddress (data) {
      this.$emit('afterSelectaddress', data)
    },
    afterDeleteaddress () {
      //
    },
    afterSetplaceid () {
      this.$emit('afterSetplaceid')
      this.show_modal = false
    }
  }
}
</script>
