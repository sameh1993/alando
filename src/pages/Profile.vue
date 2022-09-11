<template>
  <q-page padding>

    <StickyBack
    url="/account/menu"
    label="Back"
    v-if="isMobile"
    />
    <LocationNav v-else/>

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">

          <div class="row">
            <!-- left -->
            <div v-if="!isMobile" class="col-md-4 col-sm-4 col-xs-12">

            <AccountNav></AccountNav>

            </div>
            <!-- left -->

             <!-- right -->
            <div class="col-md-8 col-sm-8 col-xs-12 ">

                <q-card flat class="fit">

                  <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <q-img
                        :src="avatar"
                        fit="contain"
                      />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <h5 class="text-weight-bold no-margin">Profile</h5>
                    <q-item-label caption>
                      {{first_name}} {{last_name}}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                 <q-separator />

                  <q-space class="q-mt-lg" />

                  <q-form
                  @submit="checkForm"
                  class="q-pa-md"
                  >
                  <q-input v-model="first_name"  bg-color="mygrey" color="warning"  outlined label="First name"
                  :rules="[ val => val && val.length > 0 || 'This field is required']"
                   />
                  <q-input v-model="last_name"  bg-color="mygrey" color="warning"  outlined  label="Last name"
                  :rules="[ val => val && val.length > 0 || 'This field is required']"
                  />
                  <q-input v-model="email_address"  bg-color="mygrey" color="warning"  outlined  label="Email"
                  :rules="[ val => val && val.length > 0 || 'This field is required']"
                  />
                  <q-input v-model="mobile_number"  :prefix="prefix" mask="##################" bg-color="mygrey" color="warning"  outlined  label="Mobile number"
                  :rules="[ val => val && val.length > 0 || 'This field is required']"
                   />

                  <q-btn
                  type="submit"
                  unelevated
                  rounded
                  color="warning"
                  text-color="black" no-caps
                  class="full-width"
                  label="Save"
                  size="17px"
                  :dense="$q.screen.lt.sm"
                  :loading="loading"
                  >
                  </q-btn>

                  </q-form>

                </q-card>

            </div>
            <!-- right -->

          </div> <!-- row -->

      </div> <!-- col -->
    </div>  <!-- row -->

    <StepsVerification
    ref="steps_verification"
    :sent_message="sent_message"
    @after-verifycode="afterVerifycode"
    />

  </q-page>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import APIinterface from 'src/api/APIinterface'
import auth from 'src/api/auth'

export default {
  name: 'Profile',
  components: {
    LocationNav: defineAsyncComponent(() => import('components/LocationNav')),
    AccountNav: defineAsyncComponent(() => import('components/AccountNav')),
    StepsVerification: defineAsyncComponent(() => import('components/StepsVerification')),
    StickyBack: defineAsyncComponent(() => import('components/StickyBack'))
  },
  data () {
    return {
      loading: false,
      first_name: '',
      last_name: '',
      email_address: '',
      mobile_number: '',
      prefix: '',
      avatar: '',
      original_email_address: '',
      original_mobile_number: '',
      sent_message: ''
    }
  },
  mounted () {
    this.getCurrentProfile()
    this.getProfile()
  },
  computed: {
    isMobile () {
      if (this.$q.screen.lt.md) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getCurrentProfile () {
      const $oldprofile = auth.getUser()
      if ($oldprofile) {
        this.original_email_address = $oldprofile.email_address
        this.original_mobile_number = $oldprofile.contact_number
      }
    },
    getProfile () {
      this.loading = true
      APIinterface.getProfile()
        .then(data => {
          this.first_name = data.details.first_name
          this.last_name = data.details.last_name
          this.email_address = data.details.email_address
          this.mobile_number = data.details.mobile_number
          this.prefix = data.details.mobile_prefix
          this.avatar = data.details.avatar
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
        })
    },
    checkForm () {
      let _change = false
      if (this.email_address !== this.original_email_address) {
        _change = true
      }
      const phone = this.prefix + this.mobile_number
      if (phone !== this.original_mobile_number) {
        _change = true
      }

      if (_change) {
        this.loading = true
        APIinterface.RequestEmailCode()
          .then(data => {
            this.sent_message = data.msg
            this.show_modal = false
            this.$refs.steps_verification.show_modal = true
          })
          .catch(error => {
            APIinterface.notify('negative', error, 'error_outline', this.$q)
          })
          .then(data => {
            this.loading = false
          })
      } else {
        this.onSubmit('')
      }
    },
    onSubmit (code) {
      this.loading = true
      const params = {
        code: code,
        first_name: this.first_name,
        last_name: this.last_name,
        email_address: this.email_address,
        mobile_number: this.mobile_number,
        mobile_prefix: this.prefix
      }
      APIinterface.saveProfile(params)
        .then(data => {
          this.$refs.steps_verification.show_modal = false
          auth.setUser(data.details)
          APIinterface.notify('positive', data.msg, 'check_circle', this.$q)
          this.getCurrentProfile()
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
        })
    },
    afterVerifycode (code) {
      this.onSubmit(code)
    }
  }
}
</script>

<style lang="sass">
</style>
