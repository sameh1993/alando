<template>
  <q-page padding>

    <LocationNav/>

    <div class="row justify-center q-pa-md ">
      <div class="col-md-9 col-12">

        <q-card flat class="w-75" style="margin:auto;">
          <q-card-section>

            <div class="text-center q-mb-md">
              <h4 class="no-margin text-weight-bold q-pb-sm">Sign In</h4>
              <p class="text-weight-thin">Sign in to your account.</p>
            </div>

            <div class="w-75 margin-auto" >

              <q-form
              @submit="onSubmit"
              >

              <div class="q-mb-xs">
              <q-input bg-color="mygrey" color="warning"  outlined v-model="username" label="Mobile number or email"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'This field is required']"
              />
              </div>

              <div class="q-mb-xs">
                <q-input bg-color="mygrey" color="warning" :type="password_type.type" outlined v-model="password" label="Password"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'This field is required']"
                >
                  <template v-slot:append>
                    <q-icon :name="password_type.icon" @click="changeFieldType"  class="cursor-pointer" />
                  </template>
                </q-input>
              </div>

               <div class="q-mb-lg">
                <q-btn
                flat
                :ripple="false"
                text-color="negative" no-caps
                class="full-width no-hover"
                dense
                to="/forgotpassword"
                >
                <u>Forgot your password?</u>
                </q-btn>
              </div>

              <template v-if="!loading_settings">
                <div class="q-mb-md">
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

              <div class="q-mb-lg">
                <q-btn
                type="submit"
                unelevated
                rounded
                color="warning"
                text-color="black" no-caps
                class="full-width"
                label="Sign in"
                size="17px"
                :loading="loading"
                :dense="$q.screen.lt.sm"
                >
                </q-btn>
              </div>

              </q-form>

              <div class="text-center q-mb-md">
               <p class="no-margin">Don't have an account?</p>
                <q-btn
                flat
                :ripple="false"
                text-color="negative" no-caps
                class="full-width no-hover"
                label="Sign up"
                dense
                to="/signup"
                >
                </q-btn>
              </div>

               <template v-if="!loading_settings">
               <div class="q-mb-lg" v-if="settings.merchant_fb_flag==1">
                <componentsFacebook
                ref="facebook"
                title="Login with Facebook"
                :app_id="settings.merchant_fb_app_id"
                :verification="settings.signup_enabled_verification"
                button_width="250"
                version="v13.0"
                @social-registration="socialRegistration"
                :errors="{
                  user_cancelled: 'User cancelled login or did not fully authorize.'
                }"
                />
              </div>
              </template>

              <template v-if="!loading_settings">
               <div class="q-mb-lg" v-if="settings.merchant_google_login_enabled==1" >
                <componentsGoogleLogin
                ref="googlelogin"
                title="Login with Google"
                :show_button="settings.merchant_google_login_enabled"
                :client_id="settings.merchant_google_client_id"
                :verification="settings.signup_enabled_verification"
                button_width="250"
                cookiepolicy="single_host_origin"
                scope="profile"
                redirect_to=""
                @social-registration="socialRegistration"
                :errors="{
                  user_cancelled: 'User cancelled login or did not fully authorize.'
                }"
                />
              </div>
              </template>

              <div v-if="settings.signup_enabled_terms==1" class="q-pl-md q-pr-md q-pt-sm" >
                <p class="font12 text-weight-thin" v-html="settings.signup_terms" ></p>
              </div>

            </div>
            <!-- w-75 -->

          </q-card-section>
        </q-card>

      </div>  <!-- col -->
    </div>
    <!-- row   -->

  </q-page>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import APIinterface from 'src/api/APIinterface'
import auth from 'src/api/auth'

export default {
  name: 'Login',
  components: {
    LocationNav: defineAsyncComponent(() => import('components/LocationNav')),
    componentsRecaptcha: defineAsyncComponent(() => import('components/componentsRecaptcha')),
    componentsFacebook: defineAsyncComponent(() => import('components/componentsFacebook')),
    componentsGoogleLogin: defineAsyncComponent(() => import('components/componentsGoogleLogin'))
  },
  data () {
    return {
      loading: false,
      loading_settings: false,
      settings: [],
      username: '',
      password: '',
      password_type: {
        type: 'password',
        icon: 'visibility'
      },
      recaptcha_response: ''
    }
  },
  mounted () {
    if (auth.authenticated()) {
      this.$router.push('/menu')
    }

    this.getSignupSettings()
  },
  methods: {
    changeFieldType () {
      if (this.password_type.type === 'password') {
        this.password_type = { type: 'text', icon: 'visibility_off' }
      } else {
        this.password_type = { type: 'password', icon: 'visibility' }
      }
    },
    onSubmit () {
      this.loading = true
      const params = {
        username: this.username,
        password: this.password,
        local_id: APIinterface.getStorage('local_id'),
        recaptcha_response: this.recaptcha_response
      }
      APIinterface.userLogin(params)
        .then(data => {
          auth.setUser(data.details.user_data)
          auth.setToken(data.details.user_token)
          if (this.$route.query.checkout === 'true') {
            this.$router.push('/checkout')
          } else {
            this.$router.push('/menu')
          }
        })
        .catch(error => {
          this.loading = false
          APIinterface.notify('negative', error, 'error_outline', this.$q)
          if (this.settings.merchant_captcha_enabled) {
            this.$refs.recapcha.reset()
          }
        })
        .then(data => {
          this.loading = false
        })
    },
    getSignupSettings () {
      /* eslint-disable */
      this.loading_settings = true
      APIinterface.getSignupSettings()
        .then(data => {
            this.settings = data.details
            this.mobile_prefix = this.settings.phonecode
        })
        .catch(error => {
          this.settings = []
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading_settings = false
        })
    },
    recaptchaVerified(response) {
	     	this.recaptcha_response = response;
		},
		recaptchaExpired() {
       if(this.settings.merchant_captcha_enabled=="1"){
         this.$refs.recapcha.reset()
       }
		},
		recaptchaFailed() {

	  },
    socialRegistration(data){
      data.local_id = APIinterface.getStorage("local_id")
      APIinterface.socialRegistration(data)
        .then(data => {
           if(data.details.redirect.page==='verify'){
             this.$router.push({ path: '/account/verify', query: { uuid: data.details.redirect.uuid} })
           } else if ( data.details.redirect.page==='complete-registration' ){
             this.$router.push({ path: '/account/complete-registration', query: { uuid: data.details.redirect.uuid} })
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

        })
    }
  }
}
</script>
