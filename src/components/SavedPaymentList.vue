<template>

   <q-list v-if="loading">
     <q-item v-for="i in 3" :key="i" >
       <q-item-section avatar ><q-skeleton type="QRadio" size="25px" /></q-item-section>
       <q-item-section><q-skeleton type="text"></q-skeleton></q-item-section>
       <q-item-section  side><q-skeleton type="QRadio" size="25px" /></q-item-section>
      </q-item>
   </q-list>

   <q-list v-else>
    <template v-for="items in data" :key="items.payment_code" >
    <q-item  clickable v-ripple >
      <q-item-section avatar >
         <template v-if="items.logo_type==='icon'">
            <q-icon color="warning" name="credit_card" />
         </template>
         <template v-else>
              <q-img
                :src="items.logo_image"
                fit="contain"
                style="height: 30px; max-width: 30px"
              />
         </template>
      </q-item-section>

      <q-item-section>
        <template v-if="items.attr1">
           <p class="no-margin">{{items.attr1}}</p>
           <p class="no-margin font11 text-grey">{{items.attr2}}</p>
        </template>
        <template v-else>
           {{items.payment_name}}
        </template>
      </q-item-section>

      <q-item-section  side>
          <div class="row inline items-center">
              <q-icon v-if="items.payment_uuid===default_payment_uuid" name="check" size="sm" color="warning" class="q-mr-md" />
              <q-fab color="grey-5" icon="more_horiz" unelevated direction="left" padding="2px">
                <q-fab-action
                 v-if="items.payment_uuid!=default_payment_uuid"
                color="warning" class="font12"  text-color="black"
                  icon="done"  label="Set default"
                  @click="setDefault(items.payment_uuid)"
                  padding="4px"
                />
                <q-fab-action
                color="negative" class="font12" text-color="white"
                icon="clear" label="Delete"
                padding="4px"
                @click="deletePayment(items)"
                 />
              </q-fab>
         </div>
      </q-item-section>
    </q-item>
    <q-separator spaced inset />
    </template>
  </q-list>
</template>

<script>
import APIinterface from 'src/api/APIinterface'

export default {
  name: 'SavedPaymentList',
  data () {
    return {
      loading: false,
      data: [],
      credentials: [],
      default_payment_uuid: ''
    }
  },
  mounted () {
    this.SavedPaymentList()
  },
  watch: {
    default_payment_uuid (newval, oldval) {
      this.$emit('setPaymentuuid', newval)
    }
  },
  methods: {
    SavedPaymentList () {
      this.loading = true
      APIinterface.SavedPaymentList(APIinterface.getStorage('cart_uuid'))
        .then(data => {
          this.data = data.details.data
          this.credentials = data.details.credentials
          this.default_payment_uuid = data.details.default_payment_uuid
          this.$emit('afterLoadpaymentlist', true)
        })
        // eslint-disable-next-line
        .catch(error => {
          this.data = []
          this.credentials = []
          this.default_payment_uuid = ''
          this.$emit('afterLoadpaymentlist', false)
        })
        .then(data => {
          this.loading = false
        })
    },
    setDefault (paymentUuid) {
      APIinterface.setDefaultPayment(paymentUuid)
        .then(data => {
          this.default_payment_uuid = paymentUuid
          this.SavedPaymentList()
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {

        })
    },
    deletePayment (data) {
      const $data = {
        payment_code: data.payment_code,
        payment_uuid: data.payment_uuid
      }
      APIinterface.deleteSavedPaymentMethod($data)
        .then(data => {
          this.SavedPaymentList()
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {

        })
    }
  }
}
</script>
