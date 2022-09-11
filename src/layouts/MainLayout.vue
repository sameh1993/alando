<template>
  <q-layout view="lHh Lpr lFf">

      <q-header class="cheader" >
        <q-toolbar class="bg-yellow">
          <div class="row items-center justify-start full-width">

            <div class="col-md-2 col-6">
                <router-link to="/">
                <img
                alt=""
                src="logored@2x.png"
                class="cursor-pointer top-logo"
                style=" max-width:170px; max-height: 50px;"
                >
                </router-link>
            </div>
            <!-- col -->
            <div class="col-6 gt-sm">
               <div class="q-pa-md">
               <q-input
               class="text-search"
               outlined
               rounded
               v-model="q"
               label="Search"
               dense
               bg-color="white"
               label-color="grey"
               :loading="awaitingSearch"
               >
                 <template v-slot:prepend>
                  <q-icon name="ion-search" />
                 </template>
               </q-input>
               </div>

            </div>
            <!-- col -->
            <div class="col-4 gt-sm">
                <div class="column items-end" >

                 <template v-if="!is_login">
                 <q-btn-group
                  outline
                  >
                  <q-btn  label="Menu" to="/menu" />
                  <q-btn  label="Orders" to="/orders" />
                  <q-btn  label="Signup" to="/signup" />
                  <q-btn  label="Login" to="/login" />
                  <q-btn  class="" @click="showCart" >
                      <q-icon name="img:shopping-bag.svg" />
                      <q-badge color="dark" rounded floating>{{cartStore.counter}}</q-badge>
                  </q-btn>
                  </q-btn-group>
                  </template>

                  <template v-else>
                    <q-btn-group
                      outline
                      >
                      <q-btn label="Menu" to="/menu" />
                      <q-btn label="Orders" to="/orders"  />
                      <q-btn style="padding:4px 3px;" >
                        <q-chip style="margin:0;" color="grey-2" >
                          <q-avatar size="sm">
                              <q-img
                                :src="avatar"
                                fit="contain"
                              />
                          </q-avatar>
                          <div class="ellipsis" style="max-width: 60px;">{{first_name}}</div>
                        </q-chip>
                         <q-menu
                          transition-show="jump-down"
                          transition-hide="jump-up"
                          active="red"
                         >
                           <q-list style="max-width: 200px">
                              <q-item clickable v-close-popup to="/account/profile" >
                                <q-item-section>My Account</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup  to="/account/change-password" >
                                <q-item-section>Change Password</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup to="/account/addresses">
                                <q-item-section>Addresses</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup to="/account/payments">
                                <q-item-section>Payments</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup to="/account/favourites">
                                <q-item-section>Favorites</q-item-section>
                              </q-item>
                              <q-item clickable v-close-popup @click="logout" >
                                <q-item-section>Logout</q-item-section>
                              </q-item>
                           </q-list>
                         </q-menu>
                      </q-btn>
                      <q-btn class="" @click="showCart" >
                          <q-icon name="img:shopping-bag.svg" />
                          <q-badge color="dark" rounded floating>{{cartStore.counter}}</q-badge>
                      </q-btn>
                      </q-btn-group>
                  </template>

                </div>
            </div>
            <!-- col -->

           <div class="col-6 lt-md">
               <div class="column items-end" >
               <q-btn-group
                outline
                >
               <q-btn to="/cart">
                  <q-icon name="img:shopping-bag.svg" />
                  <q-badge id="mobile-cart-count" color="dark" rounded floating>{{cartStore.counter}}</q-badge>
               </q-btn>
               </q-btn-group>
               </div>
           </div>

          </div>
          <!-- row -->
        </q-toolbar>
      </q-header>

    <!-- cart components -->
    <section :class="this.$route.name">
    <q-drawer
      side="right"
      v-model="cart_drawer"
      :show-if-above="false"
      :width="350"
      :breakpoint="sm"
      bordered
      :overlay="is_overlay"
    >
    <q-scroll-area class="fit" >
      <q-page padding style="padding-bottom:100px;">
        <CartDrawer
        ref="cart"
        :page="this.$route.path"
        @set-cartcount="setCartcount"
        @show-transaction="showTransaction"
        />
       </q-page>
     </q-scroll-area>
    </q-drawer>
    </section>
    <!-- cart components -->

    <!-- Mobile menu footer -->
    <q-footer bordered class="bg-white text-dark lt-md">
       <q-tabs
        v-model="mobile_tabmenu"
        dense
        indicator-color="transparent"
        active-color="dark"
        class="text-grey-5"
        align="justify"
        content-class="qtabs-modified"
        >
        <q-route-tab name="home" icon="o_home" label="Home" no-caps to="/home"  />
        <q-route-tab name="menu" icon="o_lunch_dining" label="Menu" no-caps to="/menu" />
        <q-route-tab name="browse" icon="o_manage_search" label="Browse" no-caps to="/search" />
        <q-route-tab name="orders" icon="o_receipt_long" label="Orders" no-caps to="/orders" />
        <q-route-tab name="account" icon="o_account_circle" label="Account" no-caps to="/account/menu" />
      </q-tabs>
    </q-footer>
    <!-- Mobile menu footer -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <div class="cfooter gt-sm">
      <div class="row justify-center q-pa-md gt-xs">
        <div class="col-md-9  col-12">

          <div class="row">
            <div class="col-md-6 col-sm-6">
               <FooterApp ref="footer_app" />
            </div>
            <!-- col -->
            <div class="col-md-6 col-sm-6 text-right">
              <Subscribe ref="subscribe" />
            </div>
            <!-- col -->
          </div>
          <!-- row -->

        </div>
         <!-- col -->
       </div>
       <!-- row -->

       <q-separator />
       <Footer ref="footer"></Footer>

    </div>
    <!-- cfooter -->

  </q-layout>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import auth from 'src/api/auth'
import { useCartStore } from 'stores/Cart'

export default ({
  name: 'MainLayout',
  components: {
    // Cart: defineAsyncComponent(() => import('components/Cart')),
    CartDrawer: defineAsyncComponent(() => import('components/CartDrawer')),
    Subscribe: defineAsyncComponent(() => import('components/Subscribe')),
    FooterApp: defineAsyncComponent(() => import('components/FooterApp')),
    Footer: defineAsyncComponent(() => import('components/Footer'))
  },
  setup () {
    const cartStore = useCartStore()
    return { cartStore }
  },
  data () {
    return {
      data: [],
      cart_qty: 0,
      path: '',
      cart_drawer: false,
      is_overlay: true,
      is_login: false,
      avatar: '',
      first_name: '',
      q: '',
      awaitingSearch: false,
      mobile_tabmenu: 'home'
    }
  },
  mounted () {
    this.path = this.$route.path
    if (this.$route.path === '/menu') {
      if (this.$q.screen.md) {
        this.cart_drawer = true
        this.is_overlay = false
      }
    }
    this.is_login = this.authenticated()

    this.getCurrentProfile()
  },
  updated () {
    this.is_login = this.authenticated()
    if (this.is_login) {
      this.getCurrentProfile()
    }

    this.path = this.$route.path
    this.is_overlay = true
    if (this.$route.path === '/menu') {
      if (this.$q.screen.md) {
        this.cart_drawer = true
        this.is_overlay = false
      }
      if (this.$route.params.addcart === 'true') {
        this.$refs.cart.refreshCart()
      }
    } else if (this.$route.path === '/account/trackorder') {
      this.$refs.cart.refreshCart()
      this.cart_drawer = false
    } else {
      this.cart_drawer = false
    }
  },
  computed: {
    iSCartPage () {
      if (this.$route.name === 'cart') {
        return false
      }
      return true
    }
  },
  watch: {
    q (newdata, oldata) {
      if (!this.awaitingSearch) {
        if (typeof this.q === 'undefined' || this.q === null || this.q === '' || this.q === 'null' || this.q === 'undefined') {
          return false
        }
        setTimeout(() => {
          this.awaitingSearch = false
          this.$router.push({ name: 'menusearch', params: { q: this.q } })
        }, 1000) // 1 sec delay
      }
      this.awaitingSearch = true
    }
  },
  methods: {
    getCurrentProfile () {
      const $oldprofile = auth.getUser()
      if ($oldprofile) {
        this.avatar = $oldprofile.avatar
        this.first_name = $oldprofile.first_name
      }
    },
    showCart () {
      if (this.$route.path === '/checkout') {
        //
      } else {
        this.cart_drawer = !this.cart_drawer
      }
    },
    setCartcount (qty) {
      this.cart_qty = qty
    },
    showTransaction () {
      this.$refs.delivery_details.show_modal = true
    },
    authenticated () {
      if (auth.authenticated()) {
        return true
      }
      return false
    },
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
})
</script>

<style lang="scss" scoped>

</style>
