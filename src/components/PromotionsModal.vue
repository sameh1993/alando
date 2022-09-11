<template>
  <q-dialog v-model="show_modal" persistent transition-show="scale" transition-hide="scale" >
      <q-card class="q-pa-md" style="width: 500px; max-width: 80vw;" >
        <q-card-section class="row items-center q-pb-none  no-margin no-padding">
          <q-space />
          <q-btn icon="ion-close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form
          @submit="onApplyPromocode"
          >
          <h5 class="text-weight-bold no-margin">Enter Promo Code</h5>
          <div class="row q-mt-md q-col-gutter-md">
             <div class="col-8">
               <q-input dense bg-color="mygrey" color="warning"  outlined v-model="promo_code"
                :rules="[ val => val && val.length > 0 || 'Please enter promo code']"
               />
             </div>
             <div class="col-4">
                <q-btn
                  type="submit"
                  unelevated
                  dense
                  rounded
                  color="warning"
                  text-color="black" no-caps
                  class="full-width"
                  label="Apply"
                  size="17px"
                  :loading="loading_apply"
                  >
                  </q-btn>
             </div>
          </div>
          </q-form>
        </q-card-section>
        <q-card-section>
           <q-list v-for="items in data" :key="items.promo_id" class="q-mb-sm" bordered>
               <q-item clickable v-ripple>
                <q-item-section >
                   <q-item-label>{{items.title}}</q-item-label>
                   <q-item-label caption >
                       <p>{{items.sub_title}}</p>
                       <p>{{items.valid_to}}</p>

                   <template v-if="promo_selected.promo_id===items.promo_id">
                     <q-btn flat @click="removePromo(items)" :loading="loading" color="negative" no-caps class="no-padding absolute-bottom-right q-mr-sm">Remove</q-btn>
                   </template>
                   <template v-else>
                     <q-btn flat @click="usePromo(items)" :loading="loading" color="warning" no-caps class="no-padding absolute-bottom-right q-mr-sm">Use now</q-btn>
                   </template>

                   </q-item-label>
                </q-item-section>
               </q-item>
           </q-list>
        </q-card-section>

      </q-card>
    </q-dialog>
</template>

<script>
import APIinterface from 'src/api/APIinterface'

export default {
  name: 'PromotionsModal',
  data () {
    return {
      show_modal: false,
      data: [],
      promo_selected: [],
      loading: false,
      loading_apply: false,
      promo_code: ''
    }
  },
  mounted () {
    this.loadPromo()
  },
  methods: {
    loadPromo () {
      this.$emit('beforeLoadpromo')
      APIinterface.loadPromo(APIinterface.getStorage('cart_uuid'))
        .then(data => {
          this.data = data.details.data
          this.promo_selected = data.details.promo_selected
          this.$emit('aftergetPromo', {
            count: data.details.count,
            promo_selected: data.details.promo_selected
          })
        })
        .catch(error => {
          console.debug(error)
        })
        .then(data => {
          this.$emit('afterLoadpromo')
        })
    },
    usePromo (data) {
      this.loading = true
      const $params = {
        cart_uuid: APIinterface.getStorage('cart_uuid'),
        promo_id: data.promo_id,
        promo_type: data.promo_type
      }
      APIinterface.applyPromo($params)
        .then(data => {
          this.show_modal = false
          this.loadPromo()
          this.$emit('afterApplypromo')
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
        })
    },
    removePromo (data) {
      this.loading = true
      const $params = {
        cart_uuid: APIinterface.getStorage('cart_uuid'),
        promo_id: data.promo_id,
        promo_type: data.promo_type
      }
      APIinterface.removePromo($params)
        .then(data => {
          this.promo_selected = []
          this.loadPromo()
          this.$emit('afterRemovepromo')
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
        })
    },
    onApplyPromocode () {
      this.loading_apply = true
      const $params = {
        cart_uuid: APIinterface.getStorage('cart_uuid'),
        promo_code: this.promo_code
      }
      APIinterface.applyPromoCode($params)
        .then(data => {
          this.show_modal = false
          this.promo_code = ''
          this.loadPromo()
          this.$emit('afterApplypromo')
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading_apply = false
        })
    }
  }
}
</script>
