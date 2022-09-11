<template>
  <q-dialog v-model="show_modal" persistent transition-show="scale" transition-hide="scale" >
      <q-card style="width: 500px; max-width: 80vw;" >
        <q-card-section class="row items-center q-pb-none q-pa-md">
          <q-space />
          <q-btn icon="ion-close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
           <h5 class="text-weight-bold no-margin">{{title}}</h5>
           <div class="q-ma-sm">
           <p class="font12">{{label.notes}}</p>
           </div>
        </q-card-section>

        <q-separator spaced  />
        <q-card-actions>
           <q-btn
            unelevated
            roundedx
            color="warning"
            text-color="black" no-caps
            class="full-width q-mb-md"
            :label="label.submit"
            size="17px"
            :loading="loading"
            @click="onSubmit()"
            />
        </q-card-actions>

      </q-card>
  </q-dialog>
</template>

<script>
import APIinterface from 'src/api/APIinterface'
import { loadScript } from 'vue-plugin-load-script'
export default {
  name: 'RazorpayComponents',
  props: ['title', 'label', 'payment_code', 'payment_credentials'],
  data () {
    return {
      show_modal: false,
      data: [],
      loading: false,
      credentials: [],
      orders: []
    }
  },
  methods: {
    showPaymentForm () {
      this.show_modal = true
      this.setCredentials()
    },
    close () {
      this.show_modal = false
    },
    closePayment () {
      this.$emit('afterCancelPayment')
    },
    setCredentials () {
      if ((typeof this.payment_credentials[this.payment_code] !== 'undefined') && (this.payment_credentials[this.payment_code] !== null)) {
        this.credentials = this.payment_credentials[this.payment_code]
      }
    },
    onSubmit () {
      const $data = {
        payment_code: this.payment_code,
        merchant_id: this.credentials.merchant_id,
        merchant_type: this.credentials.merchant_type
      }
      this.loading = true
      APIinterface.RazorpayCreateCustomer($data)
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
    },
    PaymentRender (data) {
      this.data = data
      const $data = {
        cart_uuid: data.cart_uuid,
        order_uuid: data.order_uuid,
        payment_code: data.payment_code,
        merchant_id: this.credentials.merchant_id,
        merchant_type: this.credentials.merchant_type
      }
      APIinterface.showLoadingBox("Getting payment information..<br/>don't close this window", this.$q)
      APIinterface.RazorpayCreateOrder($data)
        .then(data => {
          this.orders = data.details
          this.initRazorPay()
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          APIinterface.hideLoadingBox(this.$q)
        })
    },
    initRazorPay () {
      loadScript('https://checkout.razorpay.com/v1/checkout.js')
        .then(() => {
          this.initPayment()
        })
        .catch(() => {
          APIinterface.notify('negative', 'failed loading script', 'error_outline', this.$q)
        })
    },
    initPayment () {
      try {
        const options = {
          key: this.credentials.attr2,
          amount: this.orders.amount,
          currency: this.orders.currency,
          name: this.orders.name,
          description: this.orders.description,
          order_id: this.orders.order_id,
          customer_id: this.orders.customer_id,
          handler: response => {
            this.verifyPayment(response)
          },
          theme: {
            color: '#3399cc'
          },
          modal: {
            ondismiss: data => {
              this.closePayment()
            }
          }
        }
        /* eslint-disable */
        const rzr_handle = new Razorpay(options)
        rzr_handle.on('payment.failed', response => {
				  // this.$emit('alert', response.error.description );
        })
        rzr_handle.open()
      } catch (err) {
        APIinterface.notify('negative', err, 'error_outline', this.$q)
      }
    },
    verifyPayment(data){
       this.setCredentials()
       var $params = {
			   'cart_uuid' : this.data.cart_uuid,
			   'order_uuid' : this.data.order_uuid,
			   'payment_code' : this.data.payment_code,
			   'merchant_id' : this.credentials.merchant_id ,
			   'merchant_type' : this.credentials.merchant_type,
			   'razorpay_payment_id': data.razorpay_payment_id,
			   'razorpay_order_id': data.razorpay_order_id,
			   'razorpay_signature': data.razorpay_signature,
			};
      APIinterface.showLoadingBox("Processing payment..<br/>don't close this window", this.$q)
      APIinterface.RazorpayVerifyPayment($params)
        .then(data => {
           this.$router.push({ path: '/account/trackorder', query: { order_uuid: data.details.order_uuid } })
        })
        .catch(error => {
            APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          APIinterface.hideLoadingBox(this.$q)
        })
    }
  }
}
</script>
