<template>

  <LocationNav/>

  <q-page padding>

    <div id="menu" class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">

        <template v-if="loading">
          <div class="q-mb-md"><q-skeleton type="rect" width="250px" /></div>
          <div class="row fit justify-start items-center q-col-gutter-md">
            <div v-for="i in 8" :key="i" class="col-lg-2 col-md-3 col-sm-4 col-xs-12 q-mb-md q-mb-sm-none">
                <SkeletonItem />
            </div>
          </div>
        </template>
        <!-- skeleton loader -->

        <template v-else>

        <template v-if="hasData">
        <h4 class="no-margin text-weight-bold q-pb-sm">Search results for “{{q}}” ({{totalFound}})</h4>
        <div class="row fit justify-start items-center q-col-gutter-md">
          <!-- col -->
          <div v-for="items in data" :key="items.item_id" class="col-lg-2 col-md-3 col-sm-4 col-xs-12 q-mb-md q-mb-sm-none">

            <q-card
            flat
            bordered="false"
            class="full-height q-pa-sm">

            <q-img
            fit="contain"
            :src="items.url_image"
            class="no-margin"
            height="150px"
            loading="lazy"
            />
            <q-card-section class="no-margin q-pt-sm q-pb-none">
                <div class="text-h6 ellipsis q-mb-sm">{{ items.item_name }}</div>
                <div class="text-caption text-weight-medium"  >

                    <template v-if="items.price[0]">
                      <template v-if="items.price[0].discount <=0">
                        <span class="q-mr-sm">{{items.price[0].size_name}} {{items.price[0].pretty_price}}</span>
                      </template>
                      <template v-else>
                        <span class="q-mr-sm">{{items.price[0].size_name}} <del>{{items.price[0].pretty_price}}</del> {{items.price[0].pretty_price_after_discount}}</span>
                      </template>
                    </template>

                </div>
            </q-card-section>

            <q-card-actions class="q-pa-sm" vertical align="between">
              <q-btn
              unelevated
              rounded
              color="warning"
              text-color="black" no-caps
              class="full-width"
              label="Add to cart"
              :to="{name: 'product', params: {
                slug :items.slug ,
                cat_id: items.cat_id,
                item_uuid: items.item_uuid,
                }
                }"
              >
              </q-btn>
            </q-card-actions>

            </q-card>

          </div>
          <!-- col -->
        </div>
        <!-- row -->
        </template>
        <template v-else>
          <div class="w-50 margin-auto q-pt-lg">
            <h4 class="no-margin text-weight-bold q-pb-sm">No results for “{{q}}”</h4>
            <p class="text-grey">Sorry, no product matched for your search. Please try again.</p>
          </div>
        </template>

       </template>
       <!-- end if loading -->

      </div> <!-- col -->
   </div><!-- row -->

  </q-page>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import APIinterface from 'src/api/APIinterface'

export default {
  name: 'SearchProduct',
  data () {
    return {
      q: '',
      loading: false,
      data: []
    }
  },
  components: {
    LocationNav: defineAsyncComponent(() => import('components/LocationNav')),
    SkeletonItem: defineAsyncComponent(() => import('components/SkeletonItem'))
  },
  mounted () {
    this.initSearch()
  },
  updated () {
    this.initSearch()
  },
  computed: {
    totalFound () {
      return Object.keys(this.data).length
    },
    hasData () {
      if (Object.keys(this.data).length > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    initSearch () {
      this.q = this.$route.params.q
      this.menuSearch()
    },
    menuSearch () {
      this.loading = true
      APIinterface.menuSearch(this.q)
        .then(data => {
          this.data = data.details.data
        })
        // eslint-disable-next-line
        .catch(error => {
          this.data = []
        })
        .then(data => {
          this.loading = false
        })
    }
  }
}
</script>
