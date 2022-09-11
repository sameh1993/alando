<template>
    <template v-if="loading">
    <q-list v-for="items in 2" :key="items">
        <q-item>
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
        </q-item-section>
        <q-item-section top>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
        <q-item-section side>
           <div class="row q-col-gutter-sm">
             <div class="col"><q-skeleton type="QRadio" /></div>
             <div class="col"><q-skeleton type="QRadio" /></div>
           </div>
        </q-item-section>
        </q-item>
    </q-list>
    </template>

    <template v-else>
    <q-list>
     <template v-for="items in data" :key="items.address_uuid">
     <q-item clickable v-ripple >
       <q-item-section avatar  @click="setPlaceID(items.place_id)"  >
          <q-icon name="place" color="black" size="24px" />
        </q-item-section>
        <q-item-section top  @click="setPlaceID(items.place_id)"  >
          <q-item-label v-if="items.address.address1">{{items.address.address1}}</q-item-label>
          <q-item-label v-else>{{items.address.address2}}</q-item-label>
          <q-item-label caption>{{items.address.formatted_address}}</q-item-label>
        </q-item-section>
      <q-item-section side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn @click="$emit('fillAddress',items)" class="gt-xs" size="12px"
            flat dense round
            icon="edit" />

            <q-btn @click="deleteAddress(items.address_uuid)" class="gt-xs" size="12px"
            :disable="place_id==items.place_id?true:false"
            flat dense round
             icon="clear" />
          </div>
        </q-item-section>
    </q-item>
    <q-separator  />
    </template>

    </q-list>
    </template>

</template>

<script>
import APIinterface from 'src/api/APIinterface'

export default {
  name: 'AddressQuickList',
  data () {
    return {
      data: [],
      loading: false,
      place_id: APIinterface.getStorage('local_id')
    }
  },
  mounted () {
    this.clientAddresses()
  },
  methods: {
    clientAddresses () {
      this.loading = true
      APIinterface.clientAddresses()
        .then(data => {
          this.data = data.details.addresses
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
        })
    },
    deleteAddress (addressUuid) {
      APIinterface.deleteAddress(addressUuid)
        .then(data => {
          this.clientAddresses()
          this.$emit('afterDeleteaddress')
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {

        })
    },
    setPlaceID (placeid) {
      APIinterface.setStorage('local_id', placeid)
      this.$emit('afterSetplaceid')
    }
  }
}
</script>
