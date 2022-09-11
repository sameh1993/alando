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
        <q-card-section class="q-pa-md" style="padding-bottom:0px;">
           <h5 class="text-weight-bold no-margin">{{title}}</h5>
           <div class="q-ma-sm">
              <p class="font12">{{label.notes}}</p>
           </div>

           <q-input dense bg-color="mygrey" color="warning"  outlined v-model="cardholder_name"
            :rules="[ val => val && val.length > 0 || 'this field is required']"
            label="Cardholder name"
            />
           <div class="q-mb-md" ref="card_element"></div>

           <p class="font11">I authorise {website_name} to send instructions to the financial institution that issued my card to take payments from my card account in accordance with the terms of my agreement with {website_name}</p>

           <q-inner-loading
            :showing="visible"
            label-style="font-size: 1.1em"
          />
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
  name: 'StripeComponents',
  props: ['title', 'label', 'payment_code', 'payment_credentials'],
  data () {
    return {
      show_modal: false,
      data: [],
      loading: false,
      visible: false,
      client_secret: '',
      customer_id: '',
      publish_key: '',
      stripe: undefined,
      cardElement: undefined,
      cardholder_name: '',
      merchant_id: '',
      merchant_type: ''
    }
  },
  methods: {
    showPaymentForm () {
      this.show_modal = true
      this.createCustomer()
    },
    close () {
      this.show_modal = false
    },
    createCustomer () {
      if ((typeof this.payment_credentials[this.payment_code] !== 'undefined') && (this.payment_credentials[this.payment_code] !== null)) {
        this.merchant_id = this.payment_credentials[this.payment_code].merchant_id
        this.merchant_type = this.payment_credentials[this.payment_code].merchant_type
      }
      const $params = {
        merchant_id: this.merchant_id,
        payment_code: this.payment_code,
        merchant_type: this.merchant_type,
        reference: ''
      }
      this.loading = true
      this.visible = true
      APIinterface.StripeCreateCustomer($params)
        .then(data => {
          this.client_secret = data.details.client_secret
          this.customer_id = data.details.customer_id
          this.initStripe()
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
          this.visible = false
        })
    },
    initStripe () {
      if (window.Stripe == null) {
        new Promise((resolve) => {
          const doc = window.document
          const scriptId = 'stripe-script'
          const scriptTag = doc.createElement('script')
          scriptTag.id = scriptId
          scriptTag.setAttribute('src', 'https://js.stripe.com/v3/')
          doc.head.appendChild(scriptTag)
          scriptTag.onload = () => {
            resolve()
          }
        }).then(() => {
          this.renderCard()
        })
      } else {
        this.renderCard()
      }
    },
    renderCard () {
      const style = {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }

      if ((typeof this.payment_credentials[this.payment_code] !== 'undefined') && (this.payment_credentials[this.payment_code] !== null)) {
        this.publish_key = this.payment_credentials[this.payment_code].attr2

        // eslint-disable-next-line
        this.stripe = Stripe(this.publish_key)
        const elements = this.stripe.elements()
        this.cardElement = elements.create('card', { style: style })
        setTimeout(() => {
          this.cardElement.mount(this.$refs.card_element)
        }, 500)
      } else {
        APIinterface.notify('dark', 'invalid payment credentials', 'warning', this.$q)
      }
    },
    onSubmit () {
      this.loading = true
      this.visible = true
      this.stripe.confirmCardSetup(
        this.client_secret,
        {
          payment_method: {
            card: this.cardElement,
            billing_details: {
              name: this.cardholder_name
            }
          }
        }
      ).then(result => {
        this.loading = false
        this.visible = false
        if (result.error) {
          // this.error[0] = result.error.message
          if (result.error.code === 'setup_intent_unexpected_state') {
            this.createIntent()
          }
        } else {
          this.savePayment(result.setupIntent.payment_method)
        }
      })
    },
    savePayment (paymentMethodId) {
      this.loading = true
      const $params = {
        payment_method_id: paymentMethodId,
        merchant_id: this.merchant_id,
        payment_code: this.payment_code,
        merchant_type: this.merchant_type,
        reference: this.reference
      }
      APIinterface.StripeSavePayment($params)
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
    createIntent () {
      const $params = {
        customer_id: this.customer_id,
        merchant_id: this.merchant_id,
        payment_code: this.payment_code,
        merchant_type: this.merchant_type
      }
      APIinterface.StripeCreateIntent($params)
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
      const params = {
        cart_uuid: data.cart_uuid,
        order_uuid: data.order_uuid,
        payment_uuid: data.payment_uuid,
        payment_code: data.payment_code
      }
      APIinterface.showLoadingBox("Processing payment..<br/>don't close this window", this.$q)
      APIinterface.StripePaymentIntent(params)
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
