
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
      { path: 'home', component: () => import('pages/Home.vue') },
      { path: 'orders', component: () => import('pages/Orders.vue'), meta: { requiresAuth: true } },
      { path: 'signup', component: () => import('pages/Signup.vue') },
      { path: 'login', component: () => import('pages/Login.vue') },
      { path: 'forgotpassword', component: () => import('pages/ForgotPassword.vue') },
      { path: 'location', component: () => import('pages/Location.vue') },
      { path: 'checkout', component: () => import('pages/Checkout.vue') },
      { path: 'cart', name: 'cart', component: () => import('pages/CartPage.vue') }
    ]
  },
  {
    path: '/menu',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'menu', props: true, component: () => import('pages/Menu.vue') },
      { path: 'search', name: 'menusearch', props: true, component: () => import('pages/SearchProduct.vue') },
      { path: 'product/:slug/:cat_id/:item_uuid', name: 'product', props: true, component: () => import('pages/Product.vue') }
    ]
  },
  {
    path: '/account',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Profile.vue') },
      { path: 'menu', component: () => import('pages/AccountMenu.vue'), meta: { requiresAuth: false } },
      { path: 'profile', component: () => import('pages/Profile.vue'), meta: { requiresAuth: true } },
      { path: 'change-password', component: () => import('pages/ChangePassword.vue'), meta: { requiresAuth: true } },
      { path: 'addresses', component: () => import('pages/Addresses.vue'), meta: { requiresAuth: true } },
      { path: 'address-new', component: () => import('pages/AddressesNew.vue'), meta: { requiresAuth: true } },
      { path: 'payments', component: () => import('pages/Payments.vue'), meta: { requiresAuth: true } },
      { path: 'payments/new', component: () => import('pages/PaymentNew.vue'), meta: { requiresAuth: true } },
      { path: 'favourites', component: () => import('pages/Favourites.vue'), meta: { requiresAuth: true } },
      { path: 'trackorder', component: () => import('pages/TrackOrder.vue'), meta: { requiresAuth: true } },
      { path: 'verify', component: () => import('pages/AccountVerify.vue') },
      { path: 'complete-registration', component: () => import('pages/CompleteRegistration.vue') }
    ]
  },
  {
    path: '/search',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SearchItem.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Error404.vue') }
    ]
  }
]

export default routes
