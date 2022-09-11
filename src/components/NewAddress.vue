<template>

     <q-card flat class="fit">

        <SearchLocation
        ref="search_location"
        :detect_location="true"
        :label_id="1"
        class_name="w-75"
        @after-selectaddress="afterSelectaddress"
        @after-geocode="afterGeocode"
        @after-geocodedone="afterGeocodedone"
        />

        <div class="q-mt-md relative-position">
        <Maps
        ref="maps"
        :lat="maps_config.default_lat"
        :lng="maps_config.default_lng"
        :zoom="maps_config.zoom"
        :keys="maps_config.key"
        class_map="maps"
        :provider="maps_config.provider"
        :drag_marker="true"
        :detect_location="false"
        :marker="marker"
        @after-selectmap="afterSelectmap"
        @drag-marker="dragMarker"
        @show-loader="showLoader"
        />
        <q-inner-loading :showing="loading_map"
        label="Please wait..."
        label-class="text-dark"
        label-style="font-size: 11px"
        >
       </q-inner-loading>
        </div>

      <div class="q-pa-md">
        <q-btn
        unelevated
        rounded
        color="warning"
        text-color="black" no-caps
        class="full-width q-mb-md"
        label="Confirm Location"
        size="17px"
        :loading="loading"
        @click="confirmLocation"
        >
        </q-btn>
      </div>

    </q-card>

</template>

<script>
import { defineAsyncComponent } from 'vue'
import APIinterface from 'src/api/APIinterface'
import jwtDecode from 'jwt-decode'

export default {
  name: 'NewAddress',
  props: ['show_cancel'],
  components: {
    SearchLocation: defineAsyncComponent(() => import('components/SearchLocation')),
    Maps: defineAsyncComponent(() => import('components/Maps'))
  },
  data () {
    return {
      // lat: '',
      // lng: '',
      address_data: [],
      maps_config: [],
      marker: [],
      loading: false
    }
  },
  mounted () {
    this.getMapsConfig()
  },
  methods: {
    getMapsConfig () {
      this.loading = true
      APIinterface.getMapsConfig()
        .then(data => {
          try {
            this.maps_config = jwtDecode(data.details.maps_config)
            this.marker = [
              { id: 0, draggable: true, icon: this.maps_config.icon, lat: this.maps_config.default_lat, lng: this.maps_config.default_lng }
            ]
          } catch (error) {
            APIinterface.notify('negative', error, 'error_outline', this.$q)
          }
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
        })
    },
    afterSelectaddress (data) {
      this.$emit('afterSelectaddress', data)
      this.address_data = data
      this.marker = [
        { id: 0, draggable: true, icon: this.maps_config.icon, lat: data.latitude, lng: data.longitude }
      ]
    },
    afterSelectmap (lat, lng) {
      this.loading = true
      this.$refs.search_location.reverseGeocoding(lat, lng, false)
    },
    afterGeocodedone () {
      this.loading = false
    },
    confirmLocation () {
      this.$emit('afterConfirmlocation', this.address_data, this.maps_config)
    },
    afterGeocode (data) {
      this.address_data = data
    }
  }
}
</script>
