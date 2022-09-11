<template>
  <q-page padding>

    <q-page-sticky expand position="top">
      <q-toolbar class="bg-white">

        <q-btn dense flat color="dark"
        icon="arrow_back_ios"
        to="/menu"
        no-caps label="Back" />
      </q-toolbar>
    </q-page-sticky>

     <div class="q-pa-lg"></div>

      <div class="row justify-center q-pa-md q-col-gutter-md">
        <!-- left -->
        <div class="col-md-6 ">

          <!-- order type -->
          <q-card flat class="q-mb-sm">
            <q-card-section>

              <div class="row items-start q-col-gutter-sm q-mb-lg">
                <div class="col-3">
                  <div class="text-h5 no-margin">Order & Time</div>
                </div>
                <div class="col-9">

                    <TransactionInfo
                    ref="transaction_info"
                    :hide_address="true"
                    @change-transaction="changeTransaction"
                    @after-getinfo="afterGetinfo"
                    />

                </div>
                <!-- col -->
              </div>
              <!-- row -->

            </q-card-section>
          </q-card>
          <!-- order type -->

          <!-- address -->
          <q-card flat class="q-mb-sm">
            <q-card-section>

              <template v-if="loading">
                <div class="row items-start q-col-gutter-sm">
                  <div class="col-3">
                     <q-skeleton type="rect" />
                  </div>
                  <div class="col-9">
                     <q-skeleton height="130px" />
                     <q-skeleton type="text" class="w-50" />
                     <q-skeleton type="text" class="w-25" />
                  </div>
                </div>
              </template>

              <div v-else class="row items-start q-col-gutter-sm">
                <div class="col-3">
                  <div class="text-h5 no-margin line-normal">Address</div>
                   <q-btn flat color="warning" no-caps class="no-padding q-ma-none"
                   @click="this.$refs.location_modal.show_modal=true"  >Change</q-btn>
                </div>
                <div class="col-9">
                    <Div v-if="checkout_address.latitude" class="bg-grey-1 maps small q-mb-sm relative-position">
                       <Maps
                        ref="maps"
                        :lat="maps_config.default_lat"
                        :lng="maps_config.default_lng"
                        :keys="maps_config.key"
                        :zoom="maps_config.zoom"
                        class_map="maps small"
                        :provider="maps_config.provider"
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
                    </Div>
                    <div class="row  items-start q-col-gutter-sm">
                      <div class="col-8 ">
                          <div v-if="checkout_address.address" class="text-h6 line-normal">{{checkout_address.address.formatted_address}}</div>
                          <p  v-if="checkout_address.address" class="font12 text-weight-thin">Delivery options: {{checkout_address.attributes.delivery_options}}</p>
                      </div>
                      <div v-if="checkout_address.address" class="col-4  text-right">
                        <q-btn @click="editAddress()" flat color="warning" no-caps >Edit</q-btn>
                      </div>
                    </div>

                </div>
                <!-- col -->
              </div>
              <!-- row -->

            </q-card-section>
          </q-card>
          <!-- address -->

          <!-- utensils -->
          <q-card flat class="q-mb-sm">
          <q-card-section>

            <div class="row items-center q-col-gutter-sm">
              <div class="col-3">
                <div class="text-h5 no-margin line-normal">Utensils</div>
              </div>
              <div class="col-9">
                  <div class="row items-center">
                     <div class="col">Include utensils and condoments</div>
                     <div>
                        <q-toggle
                          v-model="include_utensils"
                          color="warning"
                          @update:model-value="setUtensil"
                        />
                     </div>
                  </div>
              </div>
              <!-- col -->
            </div>
            <!-- row -->

          </q-card-section>
          </q-card>
          <!-- utensils -->

          <!-- phone -->
          <q-card flat class="q-mb-sm">
          <q-card-section>
            <div class="row items-start q-col-gutter-sm">
              <div class="col-3">
                <div class="text-h5 no-margin line-normal">Phone number</div>
                <q-btn @click="this.$refs.change_phone.show_modal=true" flat color="warning" no-caps class="no-padding q-ma-none">Change</q-btn>
              </div>
              <div class="col-9">
                  <template v-if="loading_phone">
                    <q-skeleton type="text" class="w-50" />
                  </template>
                  <template v-else>
                  {{phone_number}}
                  </template>
              </div>
              <!-- col -->
            </div>
            <!-- row -->

          </q-card-section>
          </q-card>
          <!-- phone -->

          <!-- promo -->
          <q-card flat class="q-mb-sm">
          <q-card-section>

            <div class="row items-center q-col-gutter-sm">
              <div class="col-3">
                <div class="text-h5 no-margin line-normal">Promo</div>
              </div>
              <div class="col-9">
                  <template v-if="loading_promo">
                    <q-skeleton type="text" class="w-50" />
                  </template>
                  <div v-else class="row items-center">
                    <div class="col ">
                      <template v-if="promo_selected.promo_id>0">
                        <p class="no-margin">Promotion applied</p>
                        <p v-if="promo_selected.savings" class="no-margin font11 text-green">{{promo_selected.savings}}</p>
                      </template>
                      <template v-else>
                          <template v-if="total_promo>0">
                            {{total_promo}} promotional available
                          </template>
                          <template v-else>
                            no promo available
                          </template>
                      </template>
                    </div>
                    <div class="col  text-right">
                      <q-btn @click="this.$refs.promotional.show_modal=true" flat color="warning" no-caps >Add</q-btn>
                    </div>
                  </div> <!-- row -->
              </div>
              <!-- col -->
            </div>
            <!-- row -->

          </q-card-section>
          </q-card>
          <!-- promo -->

        <!-- tips -->
        <q-card flat class="q-mb-sm">
        <q-card-section>

          <div class="row items-start q-col-gutter-sm">
            <div class="col-3">
              <div class="text-h5 no-margin line-normal">Tips</div>
            </div>
            <div class="col-9">

                <Tips
                ref="tips"
                @after-applytips="afterApplytips"
                ></Tips>

            </div>
            <!-- col -->
          </div>
          <!-- row -->

        </q-card-section>
        </q-card>
        <!-- tips -->

        <q-card flat class="q-mb-sm">
        <q-card-section>
          <!-- more items -->
          <SimilarItems
          ref="similar_items"
          title="People also ordered"
          />
          <!-- more items -->
        </q-card-section>
        </q-card>

         <!-- payment saved -->
        <q-card flat class="q-mb-sm" :class="{hidden:!has_payment_saved}"  >
        <q-card-section>
          <div class="row items-start q-col-gutter-sm">
            <div class="col-3">
              <div class="text-h5 no-margin line-normal">Payment</div>
            </div>
            <div class="col-9">
                <p class="font12">Saved Payment Methods</p>

                <SavedPaymentList
                ref="saved_payment"
                @onselect-payment="onselectPayment"
                @after-loadpaymentlist="afterLoadpaymentlist"
                @set-paymentuuid="setPaymentuuid"
                />

            </div>
            <!-- col -->
          </div>
          <!-- row -->

        </q-card-section>
        </q-card>
        <!-- payment saved -->

        <!-- payment -->
        <q-card flat class="q-mb-sm">
        <q-card-section>

          <div class="row items-start q-col-gutter-sm">
            <div class="col-3">
              <div class="text-h5 no-margin line-normal">Add Payment</div>
            </div>
            <div class="col-9">
                <p class="font12">Add New Payment Method</p>

                 <PaymentList
                 ref="payment_list"
                 @onchoose-payment="onchoosePayment"
                 @set-paymentcredentials="setPaymentcredentials"
                 />

            </div>
            <!-- col -->
          </div>
          <!-- row -->

        </q-card-section>
        </q-card>
        <!-- payment -->

        </div><!-- col -->
        <!-- left -->

        <!-- right -->
        <div class="col-xs-12 col-sm-12 col-md-3">
          <q-card flat>
            <q-card-section class="cart">

               <CartDetails
                ref="cart_details"
                :sticky_checkout="false"
                :payload="['items','merchant_info','service_fee','delivery_fee','packaging','packaging','tips','checkout','discount','distance','summary','total','items_count']"
                @set-cartcount="setCartcount"
                @on-placeorder="onPlaceorder"
                @set-merchantinfo="setMerchantinfo"
              />

            </q-card-section>
          </q-card>
        </div><!-- col -->
        <!-- end right -->

      </div>
      <!-- row -->

    <DeliverySched
    ref="delivery_sched"
    @after-savetrans="afterSavetrans"
    />

    <LocationModal
    ref="location_modal"
    @after-selectaddress="afterSelectaddress"
    @after-setplaceid="afterSaveaddress"
    />

    <AddressDetails
    ref="address_details"
    :locationdata="location_data"
    :maps_config="maps_config"
    @after-saveaddress="afterSaveaddress"
    />

    <ChangePhoneModal
    ref="change_phone"
    @after-getphone="afterGetphone"
    @after-changephone="afterChangephone"
    @before-loadphone="beforeLoadphone"
    @after-loadphone="afterLoadphone"
    />

    <PromotionsModal
    ref="promotional"
    @afterget-promo="aftergetPromo"
    @before-loadpromo="beforeLoadpromo"
    @after-loadpromo="afterLoadpromo"
    @after-applypromo="afterApplypromo"
    @after-removepromo="afterRemovepromo"
    />

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

    <!-- PAYMENTS COMPONENTS -->

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="warning" dense padding="10px" />
    </q-page-scroller>

  </q-page>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import APIinterface from 'src/api/APIinterface'
import auth from 'src/api/auth'

export default {
  name: 'Checkout',
  data () {
    return {
      data: [],
      include_utensils: false,
      modal_phone: false,
      modal_promo: false,
      edit_address: false,
      location_data: [],
      checkout_address: [],
      phone_number: '',
      total_promo: 0,
      promo_selected: [],
      payment_credentials: [],
      has_payment_saved: false,
      payment_uuid: '',
      loading: false,
      marker: [],
      maps_config: [],
      merchant_info: [],
      loading_phone: false,
      loading_promo: false
    }
  },
  components: {
    TransactionInfo: defineAsyncComponent(() => import('components/TransactionInfo')),
    DeliverySched: defineAsyncComponent(() => import('components/DeliverySched')),
    LocationModal: defineAsyncComponent(() => import('components/LocationModal')),
    AddressDetails: defineAsyncComponent(() => import('components/AddressDetails')),
    Maps: defineAsyncComponent(() => import('components/Maps')),
    ChangePhoneModal: defineAsyncComponent(() => import('components/ChangePhoneModal')),
    PromotionsModal: defineAsyncComponent(() => import('components/PromotionsModal')),
    Tips: defineAsyncComponent(() => import('components/Tips')),
    PaymentList: defineAsyncComponent(() => import('components/PaymentList')),
    SavedPaymentList: defineAsyncComponent(() => import('components/SavedPaymentList')),
    CartDetails: defineAsyncComponent(() => import('components/CartDetails')),
    SimilarItems: defineAsyncComponent(() => import('components/SimilarItems')),
    codComponents: defineAsyncComponent(() => import('components/codComponents')),
    ocrComponents: defineAsyncComponent(() => import('components/ocrComponents')),
    StripeComponents: defineAsyncComponent(() => import('components/StripeComponents')),
    PaypalComponents: defineAsyncComponent(() => import('components/PaypalComponents')),
    RazorpayComponents: defineAsyncComponent(() => import('components/RazorpayComponents')),
    MercadopagoComponents: defineAsyncComponent(() => import('components/MercadopagoComponents')),
    BankComponents: defineAsyncComponent(() => import('components/BankComponents'))
  },
  mounted () {
    this.checkoutAddress()
    const includeUtensils = APIinterface.getStorage('include_utensils')
    if (!APIinterface.empty(includeUtensils)) {
      this.include_utensils = includeUtensils
    }
  },
  watch: {
    merchant_info (newdata, oldata) {
      //
    }
  },
  methods: {
    authenticate () {
      auth.authenticate()
        .then(data => {
          // do nothing
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
          this.$router.push('/login')
        })
        .then(data => {

        })
    },
    changeTransaction () {
      this.$refs.delivery_sched.show_modal = true
    },
    afterGetinfo (data) {
      //
    },
    afterSavetrans (data) {
      this.$refs.transaction_info.TransactionInfo()
    },
    afterSelectaddress (data) {
      this.location_data = data
      this.$refs.location_modal.show_modal = false
      this.$refs.address_details.clearData()
      this.$refs.address_details.show_modal = true
    },
    checkoutAddress () {
      this.loading = true
      APIinterface.checkoutAddress(APIinterface.getStorage('local_id'))
        .then(data => {
          this.checkout_address = data.details.data
          this.maps_config = data.details.maps_config
          this.marker = [
            { id: 0, draggable: false, icon: this.maps_config.icon, lat: this.checkout_address.latitude, lng: this.checkout_address.longitude }
          ]
        })
        // eslint-disable-next-line
        .catch(error => {
          //
        })
        .then(data => {
          this.loading = false
        })
    },
    editAddress () {
      this.location_data = this.checkout_address
      this.$refs.address_details.show_modal = true
    },
    afterSaveaddress () {
      this.checkoutAddress()
      this.$refs.cart_details.getCart()
    },
    setUtensil (value) {
      APIinterface.setStorage('include_utensils', value)
    },
    beforeLoadphone () {
      this.loading_phone = true
    },
    afterLoadphone () {
      this.loading_phone = false
    },
    afterGetphone (data) {
      this.phone_number = data
    },
    afterChangephone (data) {
      this.phone_number = data
    },
    beforeLoadpromo () {
      this.loading_promo = true
    },
    afterLoadpromo () {
      this.loading_promo = false
    },
    aftergetPromo (data) {
      this.total_promo = data.count
      this.promo_selected = data.promo_selected
    },
    afterApplypromo () {
      this.$refs.cart_details.getCart(false)
    },
    afterRemovepromo () {
      this.$refs.cart_details.getCart(false)
    },
    setPaymentcredentials (data) {
      this.payment_credentials = data
    },
    onchoosePayment (data) {
      try {
        // this.payment_credentials = credentials
        this.$refs[data.payment_code].showPaymentForm()
      } catch (error) {
        APIinterface.notify('negative', error, 'error_outline', this.$q)
      }
    },
    afterAddpayment () {
      this.$refs.saved_payment.SavedPaymentList()
    },
    afterLoadpaymentlist (data) {
      this.has_payment_saved = data
      if (data) {
        this.$refs.cart_details.errors = []
      } else {
        this.$refs.cart_details.errors.push('Please select valid payment method')
      }
    },
    onselectPayment (data, credentials) {
      //
    },
    setPaymentuuid (data) {
      this.payment_uuid = data
    },
    afterApplytips () {
      this.$refs.cart_details.getCart(false)
    },
    onPlaceorder () {
      const $params = {
        cart_uuid: APIinterface.getStorage('cart_uuid'),
        local_id: APIinterface.getStorage('local_id'),
        include_utensils: this.include_utensils,
        payment_uuid: this.payment_uuid
      }
      this.$refs.cart_details.cart_reloading = true
      APIinterface.PlaceOrder($params)
        .then(data => {
          if (data.details.payment_instructions.method === 'offline') {
            this.$router.push({ path: '/account/trackorder', query: { order_uuid: data.details.order_uuid } })
          } else {
            this.doPayment(data.details)
          }
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.$refs.cart_details.cart_reloading = false
        })
    },
    doPayment (data) {
      this.$refs[data.payment_code].PaymentRender(data)
    },
    storeAvailable () {
      APIinterface.storeAvailable(this.merchant_info.merchant_uuid)
        .then(data => {
          //
        })
        .catch(error => {
          this.$refs.cart_details.error.push(error)
        })
        .then(data => {

        })
    },
    setMerchantinfo (data) {
      this.merchant_info = data
    }
  }
}
</script>
