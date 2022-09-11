<template>
 <!-- =>{{provider}}
 <pre>{{marker}}</pre>
 <pre>{{lat}}=>{{lng}}</pre> -->
  <div ref="cmaps" class="bg-grey-1" :class="class_map" >
  </div>
</template>

<script>
import APIinterface from 'src/api/APIinterface'
import { loadScript, unloadScript } from 'vue-plugin-load-script'

const cmapsMarker = []
let bounds = []

export default {
  name: 'Maps',
  props: ['keys', 'lat', 'lng', 'provider', 'zoom', 'marker', 'detect_location', 'class_map'],
  data () {
    return {
      cmaps: undefined,
      data: [],
      loading: false
    }
  },
  mounted () {
    this.loadMap()
  },
  watch: {
    // lat (newval, oldval) {
    //    this.updateMarker(this.marker[0].id, this.lat, this.lng)
    // },
    marker (newval, oldval) {
      this.renderMap()
    },
    provider (newval, oldval) {
      this.loadMap()
    }
  },
  methods: {
    loadMap () {
      try {
        switch (this.provider) {
          case 'google.maps':
            loadScript('https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=' + this.keys)
              .then(() => {
                this.renderMap()
              })
              .catch(() => {
                console.debug('failed loading map script')
              })
            // }
            break
          default:
            console.debug('no provider')
            break
        }
      } catch (err) {
        console.error(err)
      }
    },
    renderMap () {
      try {
        switch (this.provider) {
          case 'google.maps':
            bounds = new window.google.maps.LatLngBounds()
            if ((typeof this.cmaps !== 'undefined') && (this.cmaps !== null)) {
              Object.entries(this.marker).forEach(([key, items]) => {
                this.removeMarker(items.id)
              })
            } else {
              this.cmaps = new window.google.maps.Map(this.$refs.cmaps, {
                center: { lat: parseFloat(this.lat), lng: parseFloat(this.lng) },
                zoom: parseInt(this.zoom),
                disableDefaultUI: true
              })
            }

            Object.entries(this.marker).forEach(([key, items]) => {
              this.addMarker({
                position: { lat: parseFloat(items.lat), lng: parseFloat(items.lng) },
                map: this.cmaps,
                animation: window.google.maps.Animation.DROP,
                draggable: items.draggable,
                icon: items.icon
              }, items.id, items.draggable)
            })

            if (Object.keys(this.marker).length > 1) {
              this.FitBounds()
            } else {
              this.setCenter(this.marker[0].lat, this.marker[0].lng)
            }

            break
        }
      } catch (err) {
        // console.error(err)
      }
    },
    addMarker (properties, index, draggable) {
      try {
        switch (this.provider) {
          case 'google.maps':
            cmapsMarker[index] = new window.google.maps.Marker(properties)
            this.cmaps.panTo(new window.google.maps.LatLng(properties.position.lat, properties.position.lng))
            bounds.extend(cmapsMarker[index].position)

            if (draggable === true) {
              window.google.maps.event.addListener(cmapsMarker[index], 'drag', (marker) => {
                this.$emit('dragMarker', true)
              })

              window.google.maps.event.addListener(cmapsMarker[index], 'dragend', (marker) => {
                const latLng = marker.latLng
                this.$emit('afterSelectmap', latLng.lat(), latLng.lng())
              })
            }

            break
        }
      } catch (err) {
        console.error(err)
      }
    },
    updateMarker (index, lat, lng) {
      try {
        setTimeout(() => {
          const latlng = new window.google.maps.LatLng(lat, lng)
          if ((typeof cmapsMarker[index] !== 'undefined') && (cmapsMarker[index] !== null)) {
            cmapsMarker[index].setPosition(latlng)
            this.cmaps.panTo(latlng)
          }
        }, 10)
      } catch (err) {
        console.error(err)
      }
    },
    removeMarker (index) {
      try {
        switch (this.provider) {
          case 'google.maps':
            if ((typeof cmapsMarker[index] !== 'undefined') && (cmapsMarker[index] !== null)) {
              cmapsMarker[index].setMap(null)
              cmapsMarker.splice(index, 1)
            }
            break
        }
      } catch (err) {
        console.error(err)
      }
    },
    setCenter (lat, lng) {
      try {
        this.cmaps.setCenter(new window.google.maps.LatLng(lat, lng))
      } catch (err) {
        console.error(err)
      }
    },
    FitBounds () {
      try {
        this.cmaps.fitBounds(bounds)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
