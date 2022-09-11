<template>
  <q-page padding>

     <!-- location nav -->
    <LocationNav
    ref="location_nav"
    @after-getinfo="afterGetinfo"
    @change-transaction="changeTransaction"
    />
    <!-- location nav -->

    <div class="row justify-center q-pa-md ">
      <div class="col-md-9 col-12">

        <!-- banner -->
        <BannerCarousel
        ref="banner_carousel"
        />
        <!-- banner -->

      <!-- items of the day-->
      <section>
      <h4 class="no-margin q-pt-lg text-weight-bold">Best seller!</h4>
      <p class="text-weight-thin">Looking for Best Sellers food near your area?</p>

      <ItemCarousel
      ref="item_carousel_best"
      meta="best_seller"
      />

      </section>
      <!-- items of the day-->

      <!-- Menu -->
      <section>
      <h4 class="no-margin text-weight-bold">Menu</h4>
      <p class="text-weight-thin">What you like to eat today?</p>

      <CategoryCarousel
      ref="category_carousel"
      />

      </section>
      <!-- Menu -->

      <!-- exclusive deals -->
      <section>
      <h4 class="no-margin q-pt-lg text-weight-bold">Recommended</h4>
      <p class="text-weight-thin">See our recommended food for today</p>
       <ItemCarousel
       ref="item_carousel_recommended"
       meta="recommended"
       />
      </section>
      <!-- exclusive deals -->

      <!-- review carousel -->
     <ReviewsCarousel
     title="What people say about us"
     />
     <!-- review carousel -->

      </div> <!-- col -->
    </div> <!-- row -->

  </q-page>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  name: 'Home',
  components: {
    LocationNav: defineAsyncComponent(() => import('components/LocationNav')),
    ItemCarousel: defineAsyncComponent(() => import('components/ItemCarousel')),
    CategoryCarousel: defineAsyncComponent(() => import('components/CategoryCarousel')),
    ReviewsCarousel: defineAsyncComponent(() => import('components/ReviewsCarousel')),
    BannerCarousel: defineAsyncComponent(() => import('components/BannerCarousel'))
  },
  data () {
    return {
      slide_banner: 1,
      autoplay: true
    }
  }
}
</script>

<style lang="scss">

</style>
