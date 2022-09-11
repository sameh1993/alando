<template>
    <div v-if="loading">
          <!-- skeleton loader -->
          <div class="row fit justify-start items-center q-gutter-none q-col-gutter-md">
            <div v-for="items in screenSize" :key="items" class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <q-card
                flat
                bordered="false"
                class="my-card full-height">
                <q-item>
                  <q-skeleton height="150px" class="full-width" square  />
                </q-item>

                <q-item-section class="q-pl-md q-pr-md">
                  <q-item-label>
                    <q-skeleton type="text" class="q-pt-sm" />
                    <q-skeleton type="text" style="width:40%" />
                  </q-item-label>
                </q-item-section>

                </q-card>
            </div>
          </div>
          <!-- skeleton loader -->
       </div>
       <div v-else>
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
        >
        <q-carousel-slide v-for="(data, index) in data" :key="data.item_uuid" :name="'index'+index" class="no-padding">
              <div class="row fit justify-start items-center q-gutter-none no-wrap q-col-gutter-md" :name="'index'+index">
                <div v-for="items in data" :key="items.item_uuid" class="col-lg-3 col-md-3 col-sm-6 col-xs-12 ">
                  <router-link
                  :to="{name: 'product', params: {
                      slug : items.slug,
                      cat_id: items.category_id[0],
                      item_uuid: items.item_uuid
                      }
                  }"
                  >
                  <q-card
                  flat
                  bordered="false"
                  class="my-card full-height cursor-pointer">

                  <q-img
                  fit="contain"
                  :src="items.url_image"
                  class="no-margin"
                  loading="lazy"
                  height="150px"
                  />
                  <q-card-section class="no-margin q-pt-sm">
                      <div class="text-h6 ellipsis">{{items.item_name}}</div>
                      <div class="text-h6 q-mt-xs-none q-mt-sm-sm q-mt-md">
                         <template v-if="items.price[0]">
                           <template v-if="items.price[0].discount>0">
                              {{items.price[0].pretty_price_after_discount}}
                          </template>
                           <template v-else>
                              {{items.price[0].pretty_price}}
                           </template>
                         </template>
                      </div>
                    </q-card-section>

                  </q-card>
                  </router-link>
                </div> <!-- col  -->

              </div> <!-- row  -->
        </q-carousel-slide>
        </q-carousel>
      </div>

</template>

<script>
import APIinterface from 'src/api/APIinterface'
import { ref } from 'vue'

export default {
  name: 'ItemCarousel',
  props: ['meta'],
  data () {
    return {
      slide: ref('index0'),
      data: [],
      loading: false
    }
  },
  mounted () {
    this.getItemFeatured()
  },
  computed: {
    screenSize () {
      if (this.$q.screen.lt.sm) {
        return 1
      } else if (this.$q.screen.lt.md) {
        return 2
      } else {
        return 4
      }
    },
    hasData () {
      if (this.data.length > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    getItemFeatured () {
      this.loading = true
      APIinterface.ItemFeatured(this.meta, this.getRows())
        .then(data => {
          this.data = data.details
        })
        // eslint-disable-next-line
        .catch(error => {
          //
        })
        .then(data => {
          this.loading = false
        })
    },
    getRows () {
      if (this.$q.screen.lt.sm) {
        return 1
      } else if (this.$q.screen.lt.md) {
        return 2
      } else {
        return 4
      }
    }
  }
}
</script>
