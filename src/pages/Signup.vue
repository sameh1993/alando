<template>
  <q-page padding>

      <LocationNav/>

      <div class="row justify-center q-pa-md ">
      <div class="col-md-9 col-12">

        <div class="text-center">
        <h4 class="no-margin text-weight-bold q-pb-sm">Let's get started</h4>
        <p>Tell us more about you so we can give you a better delivery experience.</p>
        </div>

        <q-card flat >
          <q-card-section>

            <q-form
            @submit="obSubmit"
            autocomplete="off"
            >
            <h5 class="text-weight-bold">User information</h5>
            <div class="row q-col-gutter-md">
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-input bg-color="mygrey" color="warning"  outlined v-model="first_name" label="First name"
                :rules="[ val => val && val.length > 0 || 'This field is required']"
                 />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-input bg-color="mygrey" color="warning"  outlined v-model="last_name" label="Last name"
                :rules="[ val => val && val.length > 0 || 'This field is required']"
                />
              </div>
            </div>

            <h5 class="text-weight-bold">Login & Contact Details</h5>
            <div class="row q-col-gutter-md q-mb-lg">
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-input bg-color="mygrey" color="warning"  outlined v-model="email_address" label="Email"
                :rules="[val => !!val || 'this field is required', isValidEmail]"
                 />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-input bg-color="mygrey" color="warning"  outlined v-model="mobile_number" label="Mobile number"
                :prefix="mobile_prefix" mask="##################"
                :rules="[ val => val && val.length > 0 || 'This field is required' ,
                  val => val.length <= 15 || 'Please use maximum 15 characters'
                ]"
                 />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-input  type="password" bg-color="mygrey" color="warning"  outlined v-model="password" label="Password"
                :rules="[ val => val && val.length > 0 || 'This field is required' , isValidPassword]"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-input  type="password" bg-color="mygrey" color="warning"  outlined v-model="cpassword" label="Confirm password"
                :rules="[ val => val && val.length > 0 || 'This field is required', isValidPassword]"
                 />
              </div>
            </div>

            <template v-if="!loading">
              <div class="q-pl-md q-pr-md q-pt-md q-mb-sm" v-if="settings.merchant_captcha_enabled==1" >
              <componentsRecaptcha
              ref="recapcha"
              :sitekey="settings.merchant_captcha_site_key"
              :is_enabled="settings.merchant_captcha_enabled"
              size="normal"
              theme="light"
              :tabindex="0"
              @verify="recaptchaVerified"
              @expire="recaptchaExpired"
              @fail="recaptchaFailed"
              />
              </div>
            </template>

            <div v-if="settings.merchant_signup_enabled_terms==1" class="q-pl-md q-pr-md q-pt-md" >
              <p class="font12 text-weight-thin" v-html="settings.merchant_signup_terms" ></p>
            </div>

            <q-btn
              type="submit"
              unelevated
              rounded
              color="warning"
              text-color="black" no-caps
              class="full-width"
              label="Create account"
              size="17px"
              :loading="loading"
              :dense="$q.screen.lt.sm"
              >
              </q-btn>
              </q-form>
          </q-card-section>
        </q-card>

      </div> <!-- col -->
      </div>
      <!-- row -->

  </q-page>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import APIinterface from 'src/api/APIinterface'
import auth from 'src/api/auth'

export default {
  name: 'Signup',
  components: {
    LocationNav: defineAsyncComponent(() => import('components/LocationNav')),
    componentsRecaptcha: defineAsyncComponent(() => import('components/componentsRecaptcha'))
  },
  data () {
    return {
      first_name: '',
      last_name: '',
      email_address: '',
      mobile_prefix: '',
      mobile_number: '',
      password: '',
      cpassword: '',
      loading: false,
      settings: [],
      recaptcha_response: []
    }
  },
  mounted () {
    this.getSignupSettings()
  },
  methods: {
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Please enter valid email address'
    },
    isValidPassword () {
      if (this.password === this.cpassword) {
        return true
      }
      return 'Confirm password does not macth with password'
    },
    getSignupSettings () {
      /* eslint-disable */
      this.loading = true
      APIinterface.getSignupSettings()
        .then(data => {
            this.settings = data.details
            this.mobile_prefix = this.settings.default_data.phonecode
        })
        .catch(error => {
          this.settings = []
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
        })
    },
    recaptchaVerified(response) {
	     	this.recaptcha_response = response;
		},
		recaptchaExpired() {
       if(this.settings.signup_enabled_capcha=="1"){
         this.$refs.recapcha.reset()
       }
		},
		recaptchaFailed() {

	  },
    obSubmit () {
      this.loading = true
      const params = {
        local_id: APIinterface.getStorage('local_id'),
        first_name: this.first_name,
        last_name: this.last_name,
        email_address: this.email_address,
        mobile_prefix: this.mobile_prefix,
        mobile_number: this.mobile_number,
        password: this.password,
        cpassword: this.cpassword,
        recaptcha_response : this.recaptcha_response
      }
      APIinterface.registerUser(params)
        .then(data => {
          if (data.details.verify === true) {
            this.$router.push({ path: '/account/verify', query: { uuid: data.details.uuid} })
          } else {
            auth.setUser(data.details.user_data)
            auth.setToken(data.details.user_token)
            this.$router.push('/menu')
          }
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
