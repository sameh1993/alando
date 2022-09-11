<template>
  <!-- more items -->
    <div class="q-pa-md">

       <div class="row items-center justify-between q-mb-md">
        <div class="col-md-6 ">
           <q-skeleton type="rect" v-if="loading" />
           <h5 v-else class="text-weight-bold no-margin">{{title}}</h5>
        </div>
        <div class="col-md-3 text-right">
              <div class="row inline q-col-gutter-md">
                 <div class="column ">
                    <q-skeleton v-if="loading" type="circle" style="height:2.4em; width:2.4em;" />
                    <q-btn
                    v-else
                    round unelevated dense color="warning"  icon="ion-arrow-back"
                    @click="$refs.carousel_items.previous()"
                    class="btn-icon-small"
                    />
                 </div>
                 <div class="column">
                   <q-skeleton v-if="loading" type="circle" style="height:2.4em; width:2.4em;" />
                    <q-btn
                      v-else
                      round unelevated dense color="warning" icon="ion-arrow-forward"
                      @click="$refs.carousel_items.next()"
                      class="btn-icon-small"
                      />
                 </div>
              </div>
        </div>
      </div>
      <!-- row -->

      <q-carousel
        v-model="slide"
        ref="carousel_items"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        :arrows="false"
        prev-icon="ion-arrow-back"
        next-icon="ion-arrow-forward"
        height="auto"
        class="carrow-small"
        :class="bg"
        control-color="cnavigation"
        control-type="unelevated"
      >
      <q-carousel-slide v-for="(data, index) in data.data" :key="data.item_id"  :name="index" class="no-padding">
          <div class="row fit justify-start items-center q-col-gutter-sm" >
            <div  v-for="items in data" :key="items.item_id" class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <router-link
              :to="{name: 'product', params: {
                slug : items.slug ,
                cat_id: items.cat_id ,
                item_uuid: items.item_uuid,
                }
                }"
               >
              <q-card
              flat
              bordered="false"
              class="column fit q-pa-none q-pl-md q-pr-md border-grey"
              >
                <div class="row full-width items-center">
                    <div class="col-8 ">
                        <p class="text-weight-medium no-margin ellipsis">{{items.item_name}}</p>
                        <p class="font12 no-margin">
                          <template v-if="items.price[0]">
                           <template v-if="items.price[0].discount>0">
                              {{items.price[0].pretty_price_after_discount}}
                          </template>
                           <template v-else>
                              {{items.price[0].pretty_price}}
                           </template>
                         </template>
                        </p>
                      </div>
                    <div class="col-4 ">
                      <q-img
                      fit="contain"
                      :src="items.url_image"
                      class="no-margin"
                      height="80px"
                      loading="lazy"
                      />
                    </div>
                </div>
              </q-card>
              </router-link>
            </div>
        </div>
      </q-carousel-slide>
      </q-carousel>

    </div>
    <!-- more items -->
</template>

<script>
import { ref, onMounted } from 'vue'
import APIinterface from 'src/api/APIinterface'

export default {
  name: 'SimilarItems',
  props: ['title', 'bg'],
  setup () {
    const slide = ref(0)
    const loading = ref(false)
    const data = ref([])

    onMounted(() => {
      getSimilarItems()
    })

    const getSimilarItems = () => {
      loading.value = true
      APIinterface.SimilarItems()
        .then(results => {
          data.value = results.details
        })
        .catch(error => {
          console.debug(error)
        })
        .then(data => {
          loading.value = false
        })
    }

    return {
      slide,
      loading,
      data,
      getSimilarItems
    }
  }
}
</script>
