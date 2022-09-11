<template>
  <q-dialog v-model="show_modal" persistent transition-show="scale" transition-hide="scale" >
      <q-card style="width: 500px; max-width: 80vw;" >
        <q-card-section class="row items-center q-pb-none q-pa-md">
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
            <div class="col-12 ">
              <q-input dense bg-color="mygrey" color="warning"  outlined v-model="card_name"
              class="no-margin"
              label="Card name"
              :rules="[ val => val && val.length > 0 || 'this field is required']"
              />
            </div>
          </div>
          <!-- row -->

           <div class="row q-col-gutter-md">
            <div class="col ">
               <q-select v-model="identification_type" :options="identification_type_list"
               label="Identitification Type"
               dense
               outlined
               bg-color="mygrey" color="warning"
               />
            </div>
            <div class="col">
              <q-input dense bg-color="mygrey" color="warning"  outlined v-model="identification_number"
              label="Identification Number"
              class="no-margin"
              :rules="[ val => val && val.length > 0 || 'this field is required']"
              mask="####"
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

   <q-dialog v-model="modal_cvv" persistent transition-show="scale" transition-hide="scale" >
      <q-card style="width: 500px; max-width: 80vw;" >
        <q-card-section class="row items-center q-pb-none q-pa-md">
          <q-space />
          <q-btn icon="ion-close" flat round dense v-close-popup />
        </q-card-section>

      <q-form
      @submit="SubmitPayment"
      >
     <q-card-section class="q-pa-md">
          <h5 class="text-weight-bold no-margin">Verification</h5>
          <div class="q-ma-sm">
          <p class="font12">Enter CVV for card {{card_number}}</p>
          </div>

          <q-input dense bg-color="mygrey" color="warning"  outlined v-model="verify_cvv"
          label="Security Code"
          class="no-margin"
          :rules="[ val => val && val.length > 0 || 'this field is required']"
          mask="####"
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
import { loadScript } from 'vue-plugin-load-script'

let mp
export default {
  name: 'MercadopagoComponents',
  props: ['title', 'label', 'payment_code', 'payment_credentials'],
  data () {
    return {
      show_modal: false,
      data: [],
      loading: false,
      credentials: [],
      identification_type_list: [],
      identification_type: 'DNI',
      identification_number: '',
      credit_card_number: '',
      expiry_date: '',
      cvv: '',
      card_name: '',
      customer_id: '',
      payment_uuid: '',
      order_uuid: '',
      modal_cvv: false,
      card_number: '',
      verify_cvv: ''
    }
  },
  methods: {
    showPaymentForm () {
      this.show_modal = true
      this.setCredentials()
      this.includeScript(true)
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
    includeScript (initFunc) {
      loadScript('https://sdk.mercadopago.com/js/v2')
        .then(() => {
          if (initFunc) {
            this.initPayment()
            this.createCustomer()
          }
        })
        .catch(() => {
          APIinterface.notify('negative', 'failed loading script', 'error_outline', this.$q)
        })
    },
    initPayment () {
      // eslint-disable-next-line
      mp = new MercadoPago(this.credentials.attr2)
      this.identification_type_list = []
      mp.getIdentificationTypes().then((result) => {
        Object.entries(result).forEach(([key, items]) => {
          this.identification_type_list.push({
            label: items.name,
            value: items.id
          })
        })
      }).catch(e => {
        APIinterface.notify('negative', e.message, 'error_outline', this.$q)
      })
    },
    createCustomer () {
      const $params = {
        payment_code: this.payment_code,
        merchant_id: this.credentials.merchant_id,
        merchant_type: this.credentials.merchant_type
      }
      this.loading = true
      APIinterface.MercadopagoCustomer($params)
        .then(data => {
          this.customer_id = data.details.customer_id
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
        })
    },
    onSubmit () {
      /* eslint-disable */
      var str =  this.expiry_date;
	    var expiry = str.split("/");
	    var expiry_month = expiry[0]; var expiry_year = expiry[1];

      const str_card = this.credit_card_number
	    const card_number = str_card.replace(/ /g, '')


      this.is_loading = true;
      mp.createCardToken({
	    		cardNumber: card_number,
			    cardholderName: this.card_name,
			    cardExpirationMonth: expiry_month ,
			    cardExpirationYear: expiry_year ,
			    securityCode: this.cvv ,
			    identificationType: this.identification_type ,
			    identificationNumber: this.identification_number ,
	    	}).then((result) => {
	    		this.AddCard(result)
			}).catch(error => {
				this.is_loading = false;
				if ((typeof  error.message !== "undefined") && ( error.message !== null)) {
           APIinterface.notify('negative',  error.message , 'error_outline', this.$q)
				} else {
          let error
					error.forEach((item,index) => {
						error+= item.message;
					});
          APIinterface.notify('negative',  error , 'error_outline', this.$q)
				}
			});
    },
    AddCard(data){
      let $params = {
			   'payment_code' : this.payment_code,
			   'merchant_id' : this.credentials.merchant_id,
			   'merchant_type' : this.credentials.merchant_type,
			   'id' : data.id,
			   'card_name' : this.card_name,
			   'customer_id' : this.customer_id,
			};
      this.loading = true
      APIinterface.MercadopagoAddcard($params)
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
    PaymentRender(data){
      this.payment_uuid = data.payment_uuid;
	    this.order_uuid = data.order_uuid;
      let $data = {
        'payment_uuid' : this.payment_uuid,
      }
      APIinterface.showLoadingBox("Getting payment information..<br/>don't close this window", this.$q)
      APIinterface.MercadopagoGetcard($data)
        .then(data => {
           this.card_number = data.details.card_number;
	 	    	 this.card_id = data.details.card_id;
           this.includeScript(false)
           this.setCredentials()
           this.modal_cvv = true
        })
        .catch(error => {
            APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          APIinterface.hideLoadingBox(this.$q)
        })
    },
    SubmitPayment(){
      this.loading = true
      mp = new MercadoPago(this.credentials.attr2)
      mp.createCardToken({
	    	  cardId: this.card_id,
          securityCode: this.verify_cvv,
	    }).then((result) => {
           this.loading = false
           this.capturePayment(result.id);
			}).catch(error => {
        this.loading = false
				if ((typeof  error.message !== "undefined") && ( error.message !== null)) {
          APIinterface.notify('negative', error.message , 'error_outline', this.$q)
				} else {
          let err
					error.forEach((item,index) => {
						err+= item.message;
					});
          APIinterface.notify('negative', err , 'error_outline', this.$q)
				}
			});
    },
    capturePayment(card_token){
      var $params = {
			   'payment_code' : this.payment_code,
			   'merchant_id' : this.credentials.merchant_id,
			   'merchant_type' : this.credentials.merchant_type,
			   'order_uuid':this.order_uuid,
			   'cart_uuid' : APIinterface.getStorage('cart_uuid'),
			   'payment_uuid' : this.payment_uuid,
			   'card_token' : card_token
			};
      APIinterface.showLoadingBox("Processing payment..<br/>don't close this window", this.$q)
      APIinterface.MercadopagoCapturePayment($params)
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
