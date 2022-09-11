<template>
  <q-page padding>
    <!-- <LocationNav
    ref="location_nav"
    /> -->

    <DeliverySched ref="delivery_sched" />

    <div class="row justify-center q-pa-md">
      <div class="col-md-7 col-12">
        <NewAddress
          ref="new_address"
          :show_cancel="false"
          @after-confirmlocation="afterConfirmlocation"
          :loading="loading"
        />
      </div>
      <!-- col -->
    </div>
    <!-- row -->
  </q-page>
</template>

<script>
import { defineAsyncComponent, ref } from "vue";
import APIinterface from "src/api/APIinterface";
import auth from "src/api/auth";

export default {
  name: "Location",
  components: {
    // LocationNav: defineAsyncComponent(() => import('components/LocationNav')),
    NewAddress: defineAsyncComponent(() => import("components/NewAddress")),
    DeliverySched: defineAsyncComponent(() => import("components/DeliverySched")),
  },
  data() {
    return {
      loading: false,
      data: [],
    };
  },
  mounted() {
    this.$router.push({ name: "menu", params: { addcart: true } });
  },
  methods: {
    afterConfirmlocation(data) {
      if (APIinterface.empty(data.place_id)) {
        APIinterface.notify(
          "negative",
          "Enter your location or select on the map",
          "warning",
          this.$q
        );
        return;
      }

      APIinterface.setStorage("local_id", data.place_id);
      APIinterface.setStorage("local_data", JSON.stringify(data));
      const deliverySched = APIinterface.getStorage("delivery_sched");

      if (auth.authenticated()) {
        this.loading = true;
        APIinterface.SavePlaceByID(data.place_id)
          .then((data) => {
            // this.$router.push({ name: 'menu', params: { addcart: true } })
            if (APIinterface.empty(deliverySched)) {
              this.$refs.delivery_sched.showSched(true);
            } else {
              this.$router.push({ name: "menu", params: { addcart: true } });
            }
          })
          .catch((error) => {
            APIinterface.notify("negative", error, "warning", this.$q);
          })
          .then((data) => {
            this.loading = false;
          });
      } else {
        if (APIinterface.empty(deliverySched)) {
          this.$refs.delivery_sched.showSched(true);
        } else {
          this.$router.push({ name: "menu", params: { addcart: true } });
        }
      }
    },
  },
};
</script>
