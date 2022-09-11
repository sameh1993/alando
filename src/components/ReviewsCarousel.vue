<template>

      <section>
      <div class="row items-center justify-between q-mt-lg q-mb-md">
        <div class="col-md-6 ">
           <q-skeleton type="rect" v-if="loading" />
           <h4 v-else class="text-weight-bold no-margin">{{title}}</h4>
        </div>
        <div class="col-md-3 text-right">
              <div class="row inline q-col-gutter-md">
                 <div class="column ">
                    <q-skeleton v-if="loading" type="circle" style="height:2.4em; width:2.4em;" />
                    <q-btn
                    v-else
                    round unelevated dense color="warning"  icon="ion-arrow-back"
                    @click="$refs.carousel_review.previous()"
                    class="btn-icon-small"
                    />
                 </div>
                 <div class="column">
                   <q-skeleton v-if="loading" type="circle" style="height:2.4em; width:2.4em;" />
                    <q-btn
                      v-else
                      round unelevated dense color="warning" icon="ion-arrow-forward"
                      @click="$refs.carousel_review.next()"
                      class="btn-icon-small"
                      />
                 </div>
              </div>
        </div>
      </div>
      <!-- row -->

      <!-- skeleton -->
     <div v-if="loading" class="row full-width justify-start items-center q-gutter-none no-wrap">
        <div v-for="items in 3" :key="items" class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
             <q-card
                flat
                bordered
                class="full-height q-pa-sm rounded-borders-10"
              >
                <div class="row q-mt-lg q-col-gutter-md">
                  <div class="col-3 ">
                    <q-skeleton type="QAvatar" style="height:35px;width:35px;" />
                  </div>
                  <div class="col ">
                    <q-skeleton type="text" />
                    <q-skeleton type="text" />
                  </div>
                </div>

                <div class="q-pa-sm q-mt-md">
                  <q-skeleton type="text" />
                  <q-skeleton type="text" />
                  <q-skeleton type="text" />
                </div>
             </q-card>
        </div>
      </div>
      <!-- skeleton -->

      <q-carousel
        v-else
        v-model="slide"
        ref="carousel_review"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        :arrows="false"
        prev-icon="ion-arrow-back"
        next-icon="ion-arrow-forward"
        height="auto"
        class="bg-mygrey carrow-small review-corousel"
        control-color="cnavigation"
        control-type="unelevated"
      >
      <q-carousel-slide   v-for="(data, index) in data.data" :key="data.rating"  :name="index" class="no-padding">
           <div class="row fit justify-start items-center q-gutter-none no-wrap q-col-gutter-md">
             <div v-for="items in data" :key="items.rating" class="col-lg-4 col-md-4 col-sm-6 col-xs-12 col-review" >
                <q-card
                flat
                bordered
                class="full-height q-pa-sm rounded-borders-10"
                >
                <div class="row items-center q-mt-lg">
                  <div class="col">
                      <div class="row inline items-center q-col-gutter-md">
                        <div class="column">
                          <q-avatar class="col" size="35px">

                          <q-img
                          fit="contain"
                          :src="items.url_image"
                          class="no-margin"
                          loading="lazy"
                          height="35px"
                          />

                          </q-avatar>
                        </div>
                        <div class="column"><p class="no-margin">{{items.fullname}}</p></div>
                      </div>
                  </div>
                  <div class="col-3 self-start">
                     <q-icon name="format_quote" color="warning" size="2.5rem" />
                  </div>
                </div>

                <div class="q-pa-sm q-mt-md">
                  <p class="font12 text-weight-thin ellipsis-3-lines">
                    {{items.review}}
                  </p>
                </div>
                </q-card>
             </div>  <!-- col -->

          </div> <!-- row -->
      </q-carousel-slide>
      </q-carousel>
      </section>

</template>

<script>
import APIinterface from 'src/api/APIinterface'

export default {
  name: 'ReviewsCarousel',
  props: ['title'],
  data () {
    return {
      slide: 0,
      data: [],
      page: 0,
      loading: false
    }
  },
  mounted () {
    this.getReview()
  },
  computed: {
    showNextPage () {
      if (this.data.show_next_page === false) {
        return true
      }
      return false
    },
    screenSize () {
      if (this.$q.screen.lt.sm) {
        return 1
      } else if (this.$q.screen.lt.md) {
        return 2
      } else {
        return 4
      }
    }
  },
  methods: {
    getReview () {
      this.loading = true
      APIinterface.getReview(this.page, this.getRows())
        .then(data => {
          this.data = data.details
        })
        .catch(error => {
          console.debug(error)
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
        return 3
      }
    }
  }
}
</script>
