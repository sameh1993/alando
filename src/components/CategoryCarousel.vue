<template>
  <div v-if="loading" class="row fit justify-start items-center q-col-gutter-md">
    <div v-for="items in screenSize" :key="items" class="col-lg-3 col-md-2 col-sm-4 col-xs-6 text-center">
       <q-card style="max-width: 300px" flat bordered="false" class="q-pa-none">
         <q-item class="q-pa-xs">
            <q-skeleton height="100px" width="100%"  square  />
         </q-item>
         <q-item-section class="q-pa-sm">
          <q-item-label class="text-center">
            <q-skeleton type="text" />
            <q-skeleton type="text" style="width:40%;margin:auto;" />
          </q-item-label>
          </q-item-section>
       </q-card>
    </div>
  </div>

  <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        arrows
        prev-icon="ion-arrow-back"
        next-icon="ion-arrow-forward"
        height="auto"
        class="bg-mygrey carrow-small item-carousel"
        control-color="cnavigation"
        control-type="unelevated"
        v-else
      >
      <q-carousel-slide v-for="(data, index) in data" :key="data.category_uiid"  :name="'index'+index"  class="no-padding">
            <div class="row fit justify-start items-center no-wrap q-col-gutter-md">
              <div v-for="items in data" :key="items.category_uiid"  class="col-xl-3 col-lg-2 col-md-2 col-sm-4 col-xs-6 text-center">
                 <router-link to="/menu" >
                 <div class="rounded-bg">
                     <div class="row justify-center items-center fit">
                        <div class="col q-pa-sm">
                          <q-avatar size="35px">
                            <q-img
                            fit="contain"
                            :src="items.url_icon"
                            class="no-margin"
                            loading="lazy"
                            height="35px"
                            />
                          </q-avatar>
                          <div class="text-h6 q-pt-lg ellipsis">{{ items.category_name }}</div>
                          <q-badge rounded color="warning" text-color="dark" >
                            {{items.items.length}} items
                          </q-badge>
                        </div>
                      </div>
                 </div>
                 </router-link>
              </div> <!-- col  -->
            </div> <!-- row  -->
      </q-carousel-slide>
      </q-carousel>

</template>

<script>
import APIinterface from 'src/api/APIinterface'
import { ref } from 'vue'

export default {
  name: 'CategoryCarousel',
  data () {
    return {
      slide: ref('index0'),
      data: [],
      loading: false
    }
  },
  mounted () {
    this.getCategory()
  },
  computed: {
    screenSize () {
      if (this.$q.screen.lt.sm) {
        return 2
      } else if (this.$q.screen.lt.md) {
        return 3
      } else {
        return 6
      }
    }
  },
  methods: {
    getCategory () {
      this.loading = true
      APIinterface.Category(this.getRows())
        .then(data => {
          this.data = data.details.data
        })
        .catch(error => {
          APIinterface.notify('negative', error, 'error_outline', this.$q)
        })
        .then(data => {
          this.loading = false
        })
    },
    getRows () {
      if (this.$q.screen.lt.sm) {
        return 2
      } else if (this.$q.screen.lt.md) {
        return 3
      } else {
        return 6
      }
    }
  }
}
</script>
