<template>
  <q-page padding>

    <q-card flat>
      <q-list padding>
        <q-item-label header>Account</q-item-label>
        <q-item clickable v-ripple to="/account/profile" >
          <q-item-section>My account</q-item-section>
          <q-item-section avatar>
                <q-avatar size="md" color="white" text-color="dark" icon="chevron_right" />
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/account/change-password" >
          <q-item-section>Change Password</q-item-section>
          <q-item-section avatar>
                <q-avatar size="md" color="white" text-color="dark" icon="chevron_right" />
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/account/addresses">
          <q-item-section>Addresses</q-item-section>
          <q-item-section avatar>
                <q-avatar size="md" color="white" text-color="dark" icon="chevron_right" />
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/account/payments">
          <q-item-section>Payments</q-item-section>
          <q-item-section avatar>
                <q-avatar size="md" color="white" text-color="dark" icon="chevron_right" />
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/account/favourites">
          <q-item-section>Favorites</q-item-section>
          <q-item-section avatar>
                <q-avatar size="md" color="white" text-color="dark" icon="chevron_right" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

     <q-btn
      v-if="isLogin"
      unelevated
      rounded
      color="negative"
      text-color="white" no-caps
      class="full-width q-mt-md"
      label="Logout"
      size="17px"
      @click="logout"
      :dense="$q.screen.lt.sm"
      >
      </q-btn>

  </q-page>
</template>

<script>
import auth from 'src/api/auth'

export default {
  name: 'AccountMenu',
  computed: {
    isLogin () {
      if (auth.authenticated()) {
        return true
      }
      return false
    }
  },
  methods: {
    logout () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to logout?',
        stackButtons: false,
        ok: {
          unelevated: true,
          rounded: true,
          color: 'warning',
          'text-color': 'black',
          size: 'md',
          label: 'Yes',
          'no-caps': true
        },
        cancel: {
          unelevated: true,
          rounded: true,
          color: 'grey-3',
          'text-color': 'black',
          size: 'md',
          label: 'No',
          'no-caps': true
        }
      }).onOk(data => {
        auth.logout()
        this.$router.push('/home')
      })
    }
  }
}
</script>
