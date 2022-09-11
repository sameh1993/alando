<template>
  <h5 class="text-weight-bold q-pt-xs q-pb-sm">My Account</h5>
  <q-list class="text-dark list-menu q-mr-md">
    <q-item
      clickable
      v-ripple
      :active="link === 'account'"
      @click="link = 'account'"
      active-class="menu-link"
      to="/account/profile"
      dense
    >
      <q-item-section>My Account</q-item-section>
    </q-item>

    <q-item
      clickable
      v-ripple
      :active="link === 'changepass'"
      @click="link = 'changepass'"
      active-class="menu-link"
      to="/account/change-password"
      dense
    >
      <q-item-section>Change Password</q-item-section>
    </q-item>

    <q-item
      clickable
      v-ripple
      :active="link === 'addresses'"
      @click="link = 'addresses'"
      active-class="menu-link"
      to="/account/addresses"
      dense
    >
      <q-item-section>Addresses</q-item-section>
    </q-item>

    <q-item
      clickable
      v-ripple
      :active="link === 'payments'"
      @click="link = 'payments'"
      active-class="menu-link"
      to="/account/payments"
      dense
    >
      <q-item-section>Payments</q-item-section>
    </q-item>

    <q-item
      clickable
      v-ripple
      :active="link === 'favorites'"
      @click="link = 'favorites'"
      active-class="menu-link"
      to="/account/favourites"
      dense
    >
      <q-item-section>Favorites</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { ref } from "vue";

export default {
  name: "AccountNav",
  setup() {
    return {
      link: ref("account"),
    };
  },
};
</script>
