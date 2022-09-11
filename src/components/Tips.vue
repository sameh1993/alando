<template>
    <div v-if="is_loading">
      <q-skeleton type="QInput" height="30px" class="w-50" />
    </div>
    <div v-else class="relative-position">
      <q-btn-toggle
      v-model="tips"
      toggle-color="dark"
      color="grey-11"
      text-color="dark"
      no-caps
      rounded
      unelevated
      class="btn-toogle-modified"
      :options="tips_data"
      @update:model-value="updateTips"
      :dense="$q.screen.lt.sm"
      >
      </q-btn-toggle>
       <q-inner-loading
        :showing="inner_loading"
        label=""
        label-class="text-dark"
        color="warning"
        label-style="font-size: 1.1em"
      />
    </div>

    <q-form
    @submit="onApplyTips"
    v-if="tips==='fixed'"
    >
    <div class="row inline q-mt-md q-col-gutter-sm">
        <div class="">
          <q-input dense bg-color="mygrey" color="warning"  outlined v-model="manual_tip"
          :rules="[ val => val && val.length > 0 || 'Please enter promo code']"
          style="max-width:100px;"
          />
        </div>
        <div class="">
          <q-btn
            type="submit"
            unelevated
            dense
            rounded
            color="warning"
            text-color="black" no-caps
            class="q-pl-md q-pr-md"
            label="Add tip"
            size="17px"
            :loading="loading"
            >
            </q-btn>
        </div>
    </div>
  </q-form>

</template>

<script>
import APIinterface from 'src/api/APIinterface'
export default {
  name: 'Tips',
  data () {
    return {
      tips: '',
      tips_data: [],
      manual_tip: 0,
      is_loading: false,
      loading: false,
      inner_loading: false
    }
  },
  mounted () {
    this.loadTips()
  },
  methods: {
    loadTips () {
      this.is_loading = true
      APIinterface.loadTips(APIinterface.getStorage('cart_uuid'))
        .then(data => {
          this.tips = data.details.tips
          this.tips_data = data.details.data
          this.setOther()
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.is_loading = false
        })
    },
    updateTips (val) {
      if (val === 'fixed') {
        //
      } else {
        this.checkoutAddTips(val, 2)
      }
    },
    onApplyTips () {
      this.checkoutAddTips(this.manual_tip, 1)
    },
    checkoutAddTips (tip, loaderType) {
      if (loaderType === 1) {
        this.loading = true
      } else this.inner_loading = true

      const $params = {
        cart_uuid: APIinterface.getStorage('cart_uuid'),
        value: tip
      }
      APIinterface.checkoutAddTips($params)
        .then(data => {
          this.$emit('afterApplytips')
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          if (loaderType === 1) {
            this.loading = false
          } else this.inner_loading = false
        })
    },
    setOther () {
      if (this.tips > 0) {
        let $found = false
        this.tips_data.forEach((item, index) => {
          if (this.tips === item.value) {
            $found = true
          }
        })
        if (!$found) {
          this.manual_tip = this.tips
          this.tips = 'fixed'
        }
      }
    }
  }
}
</script>
