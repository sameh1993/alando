<template>
  <q-page padding>

    <LocationNav/>

    <div class="row justify-center q-pa-md ">
      <div class="col-md-9 col-12">

        <q-card flat class="w-75" style="margin:auto;">
          <q-card-section>

            <div class="text-center q-mb-md">
              <h4 class="no-margin text-weight-bold q-pb-sm">Forgot Password</h4>
              <p class="text-weight-thin">Please specify your email address to receive instructions for resetting it. If an account exists by that email, we will send a password reset </p>
            </div>

            <div class="w-75 " style="margin:auto;">

              <div class="q-mb-lg">
              <q-input bg-color="mygrey" color="warning"  outlined v-model="text" label="Email address" />
              </div>

              <div class="q-mb-lg">
                <q-btn
                unelevated
                rounded
                color="warning"
                text-color="black" no-caps
                class="full-width"
                label="Reset Password"
                size="17"
                :dense="$q.screen.lt.sm"
                >
                </q-btn>
              </div>

               <div class="q-mb-lg">
                <q-btn
                flat
                :ripple="false"
                text-color="negative" no-caps
                class="full-width no-hover"
                :dense="$q.screen.lt.sm"
                to="/login"
                >
                <u>Back to login</u>
                </q-btn>
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

export default {
  name: 'ForgotPassword',
  components: {
    LocationNav: defineAsyncComponent(() => import('components/LocationNav'))
  }
}
</script>
