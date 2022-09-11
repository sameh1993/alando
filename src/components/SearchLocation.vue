<template>

    <template v-if="label_id===1">
    <q-item class="text-center">
    <q-item-section>
        <h5 class="text-weight-bold">Enter Location</h5>
        <p class="font12 text-weight-light">Enter your delivery address to see if we delivered to your locations.</p>
    </q-item-section>
    </q-item>
    </template>
    <template v-else>
      <h5 class="text-weight-bold">Change address</h5>
    </template>

    <div class="m-auto relative-position" :class="class_name">
        <q-select
        v-model="address"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="options"
        @filter="filterFn"
        @update:model-value="selectAddress"
        rounded
        outlined
      >
        <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <q-icon name="place" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.description }}</q-item-label>
            <q-item-label caption>{{ scope.opt.addressLine2 }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:prepend>
        <q-icon name="place" />
      </template>
      <template v-slot:append>
        <q-icon name="my_location" @click="locateLocation" class="cursor-pointer" />
      </template>

      </q-select>

      <q-inner-loading
        :showing="loading"
      />

   </div>

</template>

<script>
import APIinterface from 'src/api/APIinterface'

export default {
  name: 'SearchLocation',
  props: ['detect_location', 'label_id', 'class_name'],
  data () {
    return {
      address: '',
      address_data: [],
      options: [],
      data: [],
      loading: false
    }
  },
  mounted () {
    if (this.detect_location === true) {
      this.locateLocation()
    }
  },
  methods: {
    filterFn (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }

      APIinterface.getlocationAutocomplete(val)
        .then(data => {
          update(() => {
            this.options = data.details.data
          })
        })
        .catch(error => {
          console.debug(error)
        })
        .then(data => {

        })
    },
    selectAddress (val) {
      this.address_data = val
      this.address = val.description
      APIinterface.getLocationDetails(val.id)
        .then(data => {
          const results = data.details.data
          if (!APIinterface.empty(results.latitude)) {
            this.$emit('afterSelectaddress', results)
          }
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {

        })
    },
    locateLocation () {
      this.loading = true
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.reverseGeocoding(position.coords.latitude, position.coords.longitude, true)
        }, (error) => {
          this.loading = false
          if (error.code === error.PERMISSION_DENIED) {
            APIinterface.notify('negative', error.message, 'error_outline', this.$q)
          }
        })
      } else {
        this.loading = false
        APIinterface.notify('negative', "Browser doesn't support Geolocation", 'error_outline', this.$q)
      }
    },
    reverseGeocoding (lat, lng, isEmit) {
      APIinterface.reverseGeocoding(lat, lng)
        .then(data => {
          this.data = data.details
          if (data.details.data.address) {
            this.afterGeocoding(this.data)
            if (isEmit) {
              this.$emit('afterSelectaddress', data.details.data)
            }
          }
        })
        .catch(error => {
          console.debug(error)
        })
        .then(data => {
          this.loading = false
          this.$emit('afterGeocodedone')
        })
    },
    afterGeocoding (result) {
      const data = result.data
      this.address = data.address.formatted_address
      this.address_data = {
        id: data.place_id,
        provider: result.provider,
        addressLine1: data.address.address1,
        addressLine2: data.address.address2,
        place_type: result.place_type,
        description: data.address.formatted_address
      }
      this.$emit('afterGeocode', data)
    }
  }
}
</script>
