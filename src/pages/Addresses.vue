<template>
  <q-page padding>

     <StickyBack
    url="/account/menu"
    label="Back"
    v-if="isMobile"
    />
    <LocationNav v-else/>

    <div class="row justify-center q-pa-md ">
      <div class="col-md-9 col-12 ">

          <div class="row">
            <!-- left -->
            <div v-if="!isMobile" class="col-md-4 col-sm-4 col-xs-12 ">

            <AccountNav></AccountNav>

            </div>
            <!-- left -->

             <!-- right -->
            <div class="col-md-8 col-sm-8 col-xs-12 ">

                <q-card flat class="fit">

                  <AddressesSkeleton v-if="loading" />

                  <template v-else>
                  <q-item>
                    <q-item-section>
                       <h5 class="text-weight-bold q-mb-none">Addresses</h5>
                       <p v-if="hasData"  class="no-margin font12 text-weight-thin">Wow, man of many places :)</p>
                       <p v-else class="no-margin font12 text-weight-thin">No address, lets change that!</p>
                    </q-item-section>
                   </q-item>

                 <q-separator />

                  <q-space class="q-mt-lg" />

                  <q-list v-if="hasData" >
                  <q-item v-for="items in data" :key="items.address_uuid"  class="border-bottom"
                  :clickable="isMobile"
                   @click="editAdddress(items)"
                   >
                    <q-item-section top>
                      <q-item-label lines="1">
                        <span class="text-weight-medium">{{items.attributes.address_label}}</span>
                      </q-item-label>
                      <q-item-label caption lines="1">
                        {{items.address.formatted_address}}
                      </q-item-label>
                    </q-item-section>

                     <q-item-section top side>
                      <div class="text-grey-8 q-gutter-xs">
                        <q-btn @click="confirmdeleteAddress(items.address_uuid)" class="gt-xs" size="12px" flat dense round icon="delete" />
                        <q-btn @click="editAdddress(items)" class="gt-xs" size="12px" flat dense round icon="mode_edit" />
                      </div>
                    </q-item-section>
                  </q-item>
                  </q-list>

                  <div v-else>
                    <div class="q-pa-md text-center">
                      <p class="text-grey">You don't have any address yet</p>
                    </div>
                  </div>

                  <div class="q-pa-md">
                    <q-btn
                    unelevated
                    rounded
                    color="warning"
                    text-color="black" no-caps
                    class="full-width"
                    label="Add new address"
                    size="17px"
                    :dense="$q.screen.lt.sm"
                    :loading="loading"
                    @click="this.$refs.address_modal.show_modal=true"
                    >
                    </q-btn>
                  </div>

                  </template> <!-- end loading -->
                </q-card>

            </div>
            <!-- right -->

          </div> <!-- row -->

      </div> <!-- col -->
    </div>  <!-- row -->

    <AddressModal
    ref="address_modal"
    @after-saveaddress="afterSaveaddress"
    />

    <AddressDetails
    ref="address_details"
    :locationdata="location_data"
    :maps_config="maps_config"
    :is_mobile="isMobile"
    @after-saveaddress="afterSaveaddress"
    @before-delete="confirmdeleteAddress"
    />

  </q-page>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import APIinterface from 'src/api/APIinterface'
import jwtDecode from 'jwt-decode'

export default {
  name: 'Addresses',
  components: {
    LocationNav: defineAsyncComponent(() => import('components/LocationNav')),
    AccountNav: defineAsyncComponent(() => import('components/AccountNav')),
    AddressModal: defineAsyncComponent(() => import('components/AddressModal')),
    AddressDetails: defineAsyncComponent(() => import('components/AddressDetails')),
    AddressesSkeleton: defineAsyncComponent(() => import('components/AddressesSkeleton')),
    StickyBack: defineAsyncComponent(() => import('components/StickyBack'))
  },
  mounted () {
    this.getAddresses()
    this.getMapsConfig()
  },
  computed: {
    hasData () {
      if (this.data.length > 0) {
        return true
      }
      return false
    },
    isMobile () {
      if (this.$q.screen.lt.md) {
        return true
      } else {
        return false
      }
    }
  },
  data () {
    return {
      data: [],
      loading: false,
      inner_loading: false,
      maps_config: [],
      location_data: []
    }
  },
  methods: {
    getMapsConfig () {
      APIinterface.getMapsConfig()
        .then(data => {
          try {
            this.maps_config = jwtDecode(data.details.maps_config)
          } catch (error) {
            APIinterface.notify('negative', error, 'error_outline', this.$q)
          }
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {

        })
    },
    getAddresses () {
      /* eslint-disable */
      this.loading = true
      APIinterface.getAddresses()
        .then(data => {
          this.data = data.details.data
        })
        .catch(error => {
          this.data = []
        })
        .then(data => {
          this.loading = false
        })
    },
    confirmdeleteAddress (addressUuid) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to continue?',
        stackButtons: false,
        ok: {
          unelevated: true,
          rounded: true,
          color: 'warning',
          'text-color': 'black',
          size: 'md',
          label: 'Yes',
          'no-caps': true
        },
        cancel: {
          unelevated: true,
          rounded: true,
          color: 'grey-3',
          'text-color': 'black',
          size: 'md',
          label: 'Cancel',
          'no-caps': true
        }
      }).onOk(data => {
        this.$refs.address_details.show_modal = false
        this.deleteAddress(addressUuid)
      })
    },
    deleteAddress (addressUuid) {
      this.loading = true
      APIinterface.deleteAddress(addressUuid)
        .then(data => {
          this.getAddresses()
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
        })
    },
    editAdddress (data) {
      this.location_data = data
      this.$refs.address_details.show_modal = true
    },
    afterSaveaddress () {
      this.getAddresses()
    }
  }
}
</script>

<style lang="sass">
</style>
