<template>
   <q-dialog v-model="show_modal" persistent transition-show="scale" transition-hide="scale" >
      <q-card style="width: 500px; max-width: 80vw;" >
        <q-card-section class="row items-center q-pb-none q-pt-md">
          <q-space />
          <q-btn icon="ion-close" flat round dense v-close-popup />
        </q-card-section>

         <q-form
          @submit="onSubmit"
          >
        <q-card-section class="q-pa-md">
           <h5 class="text-weight-bold no-margin">{{title}}</h5>
           <div class="q-ma-sm">
           <p class="font12">{{label.notes}}</p>
           </div>

          <div class="column q-col-gutter-sm">
            <q-input dense bg-color="mygrey" color="warning"  outlined v-model="credit_card_number"
            label="Card number"
            :rules="[ val => val && val.length > 0 || 'this field is required']"
            mask="#### #### #### ####"
            />
          </div>

          <div class="row q-col-gutter-md">
            <div class="col ">
              <q-input dense bg-color="mygrey" color="warning"  outlined v-model="expiry_date"
              label="Exp. date"
              class="no-margin"
              :rules="[ val => val && val.length > 0 || 'this field is required']"
              mask="##/##"
              />
            </div>
            <div class="col">
              <q-input dense bg-color="mygrey" color="warning"  outlined v-model="cvv"
              label="Security Code"
              class="no-margin"
              :rules="[ val => val && val.length > 0 || 'this field is required']"
              mask="####"
              />
            </div>
          </div>
          <!-- row -->

            <div class="row q-col-gutter-md">
            <div class="col ">
              <q-input dense bg-color="mygrey" color="warning"  outlined v-model="card_name"
              class="no-margin"
              label="Card name"
              :rules="[ val => val && val.length > 0 || 'this field is required']"
              />
            </div>
            <div class="col">
              <q-input dense bg-color="mygrey" color="warning"  outlined v-model="billing_address"
              class="no-margin"
              label="Billing address"
              :rules="[ val => val && val.length > 0 || 'this field is required']"
              />
            </div>
          </div>
          <!-- row -->

        </q-card-section>

        <q-separator spaced  />
        <q-card-actions>
           <q-btn
            type="submit"
            unelevated
            roundedx
            color="warning"
            text-color="black" no-caps
            class="full-width q-mb-md"
            :label="label.submit"
            size="17px"
            :loading="loading"
            />
        </q-card-actions>
        </q-form>

      </q-card>
  </q-dialog>
</template>

<script>
import APIinterface from 'src/api/APIinterface'

export default {
  name: 'ocrComponents',
  props: ['title', 'label', 'payment_code', 'payment_credentials'],
  setup () {
    return {}
  },
  data () {
    return {
      show_modal: false,
      data: [],
      loading: false,
      credit_card_number: '',
      expiry_date: '',
      cvv: '',
      card_name: '',
      billing_address: ''
    }
  },
  methods: {
    showPaymentForm () {
      this.show_modal = true
    },
    close () {
      this.show_modal = false
    },
    onSubmit () {
      this.loading = true
      let merchantId = 0
      if ((typeof this.payment_credentials[this.payment_code] !== 'undefined') && (this.payment_credentials[this.payment_code] !== null)) {
        merchantId = this.payment_credentials[this.payment_code].merchant_id
      }
      const $params = {
        credit_card_number: this.credit_card_number,
        expiry_date: this.expiry_date,
        cvv: this.cvv,
        card_name: this.card_name,
        billing_address: this.billing_address,
        merchant_id: merchantId,
        payment_code: this.payment_code
      }
      APIinterface.savedCards($params)
        .then(data => {
          this.close()
          this.$emit('afterAddpayment')
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
        })
    }
  }
}
</script>
