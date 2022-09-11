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
                  <q-item>
                    <q-item-section>
                       <div class="row items-center">
                         <div class="col-2">
                          <q-btn dense flat color="dark"
                          icon="arrow_back_ios"
                          to="/account/payments"
                          no-caps label="Back"
                          class="no-margin"
                          v-if="!isMobile"
                           />
                         </div>
                         <div class="col"><h5 class="text-weight-bold no-margin">Payment New</h5></div>
                       </div>
                    </q-item-section>
                   </q-item>
                 <q-separator />

                  <q-list v-if="hasData">
                    <template v-for="items in data" :key="items.payment_code" >
                    <q-item clickable v-ripple @click="onchoosePayment(items)">
                      <q-item-section avatar >
                        <template v-if="items.logo_type==='icon'">
                            <q-icon color="warning" name="credit_card" />
                        </template>
                        <template v-else>
                              <q-img
                                :src="items.logo_image"
                                fit="contain"
                                style="height: 35px; max-width: 35px"
                              />
                        </template>
                      </q-item-section>
                      <q-item-section>{{items.payment_name}}</q-item-section>
                    </q-item>
                    <q-separator spaced inset />
                    </template>
                </q-list>

                <div v-else>
                    <div class="q-pa-md text-center">
                      <p class="text-grey">No payment method available</p>
                    </div>
                  </div>

                </q-card>

            </div>
            <!-- right -->

          </div> <!-- row -->

      </div> <!-- col -->
    </div>  <!-- row -->

   <!-- PAYMENTS COMPONENTS -->
    <codComponents
    ref="cod"
    payment_code="cod"
    title="Add Cash On delivery"
    :label="{
    submit: 'Add Cash',
    notes : 'Cash on Delivery or COD is a payment method that allows pay for the items you have ordered only when it gets delivered.'
    }"
    :payment_credentials="payment_credentials"
    @after-addpayment="afterAddpayment"
    />

    <ocrComponents
    ref="ocr"
    payment_code="ocr"
    title="Add Credit card"
    :label="{
      submit: 'Add Card',
       notes : ''
    }"
    :payment_credentials="payment_credentials"
    @after-addpayment="afterAddpayment"
    />

    <StripeComponents
    ref="stripe"
    payment_code="stripe"
    title="Add Stripe"
    :label="{
      submit: 'Add Stripe',
      notes : 'Add your card account'
    }"
    :payment_credentials="payment_credentials"
    @after-addpayment="afterAddpayment"
    />

  <BankComponents
    ref="bank"
    payment_code="bank"
    title="Add Bank Transfer"
    :label="{
      submit: 'Add Payment',
      notes : 'Pay using bank Transfer'
    }"
    :payment_credentials="payment_credentials"
    @after-addpayment="afterAddpayment"
    />

      <PaypalComponents
    ref="paypal"
    payment_code="paypal"
    title="Add Paypal"
    :label="{
      submit: 'Add Paypal',
      notes : 'Pay using your paypal account',
      payment_title : 'Pay using Paypal',
      payment_subtitle : 'You will re-direct to paypal account to login to your account.'
    }"
    :payment_credentials="payment_credentials"
    @after-addpayment="afterAddpayment"
    />

      <RazorpayComponents
    ref="razorpay"
    payment_code="razorpay"
    title="Add Razorpay"
    :label="{
      submit: 'Submit',
      notes : 'Pay using your Razorpay account'
    }"
    :payment_credentials="payment_credentials"
    @after-addpayment="afterAddpayment"
    />

     <MercadopagoComponents
    ref="mercadopago"
    payment_code="mercadopago"
    title="Add Mercadopago"
    :label="{
      submit: 'Add Mercadopago',
      notes : 'Pay using your mercadopago account'
    }"
    :payment_credentials="payment_credentials"
    @after-addpayment="afterAddpayment"
    />

    <!-- PAYMENTS COMPONENTS -->

  </q-page>
</template>

<script>
import APIinterface from 'src/api/APIinterface'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'PaymentNew',
  components: {
    LocationNav: defineAsyncComponent(() => import('components/LocationNav')),
    AccountNav: defineAsyncComponent(() => import('components/AccountNav')),
    codComponents: defineAsyncComponent(() => import('components/codComponents')),
    ocrComponents: defineAsyncComponent(() => import('components/ocrComponents')),
    StripeComponents: defineAsyncComponent(() => import('components/StripeComponents')),
    StickyBack: defineAsyncComponent(() => import('components/StickyBack')),
    BankComponents: defineAsyncComponent(() => import('components/BankComponents')),
    PaypalComponents: defineAsyncComponent(() => import('components/PaypalComponents')),
    RazorpayComponents: defineAsyncComponent(() => import('components/RazorpayComponents')),
    MercadopagoComponents: defineAsyncComponent(() => import('components/MercadopagoComponents'))
  },
  data () {
    return {
      data: [],
      loading: false,
      payment_credentials: []
    }
  },
  mounted () {
    this.PaymentMethod()
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
  methods: {
    /* eslint-disable */
    PaymentMethod () {
      APIinterface.PaymentMethod()
        .then(data => {
          this.data = data.details.data
          this.payment_credentials = data.details.credentials
        })
        .catch(error => {
          //
        })
        .then(data => {

        })
    },
    onchoosePayment (data) {
      try {
        this.$refs[data.payment_code].showPaymentForm()
      } catch (error) {
        APIinterface.notify('negative', error, 'error_outline', this.$q)
      }
    },
    afterAddpayment () {
       this.$router.push("/account/payments")
    },
  },
}
</script>

<style lang="sass">
</style>
