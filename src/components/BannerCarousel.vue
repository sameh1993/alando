<template>
  <q-skeleton :height="screenSize" square v-if="loading" />
  <q-carousel
    v-else
    animated
    v-model="slide"
    arrows
    infinite
    swipeable
    :autoplay="autoplay"
    control-color="cnavigation"
    control-type="unelevated"
    height="400px"
    class="banner-carousel bg-grey-2"
  >
    <q-carousel-slide
      v-for="(items, index) in data"
      :key="items.banner_id"
      :name="index"
      :img-src="items.image"
    />
  </q-carousel>
</template>

<style scoped>
img {
  object-fit: fill !important;
}
</style>

<script>
import APIinterface from "src/api/APIinterface";

export default {
  name: "BannerCarousel",
  mounted() {
    this.getBanner();
  },
  data() {
    return {
      slide: 0,
      data: [],
      loading: false,
      autoplay: true,
    };
  },
  computed: {
    screenSize() {
      if (this.$q.screen.lt.sm) {
        return "150px";
      } else if (this.$q.screen.lt.md) {
        return "300px";
      } else {
        return "400px";
      }
    },
  },
  methods: {
    getBanner() {
      this.loading = true;
      APIinterface.getBanner()
        .then((data) => {
          this.data = data.details.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          //
        })
        .then((data) => {
          this.loading = false;
        });
    },
  },
};
</script>
