<template>
  <CategoryNav
    ref="category_nav"
    @show-category="showCategory"
    @after-categoryselected="afterCategoryselected"
  />

  <CategoryDialog
    ref="category_dialog"
    :data="data_category"
    @after-categoryselected="afterCategoryselected"
  />

  <q-page padding class="q-pt-xs-none">
    <div id="menu" class="row justify-center" v-scroll="onScroll">
      <div class="col-md-11 col-12">
        <template v-if="loading">
          <section v-for="i in 2" :key="i" class="q-mb-md">
            <q-skeleton type="rect" width="200px" class="q-mb-sm" />
            <div class="row fit justify-start items-center q-col-gutter-md">
              <div
                v-for="ii in 4"
                :key="ii"
                class="col-lg-2 col-md-3 col-sm-4 col-xs-12 q-mb-md q-mb-sm-none"
              >
                <SkeletonItem />
              </div>
            </div>
          </section>
        </template>
        <!-- skeleton -->

        <template v-else>
          <section
            v-for="category in data_category"
            :key="category.cat_id"
            class="q-mb-md"
          >
            <h4
              :id="category.category_uiid"
              :ref="setItemRef"
              class="no-margin text-weight-bold q-pb-sm"
            >
              {{ category.category_name }}
            </h4>
            <div class="row fit justify-start items-center q-col-gutter-md">
              <!-- item col -->
              <div
                v-for="items_id in category.items"
                :key="items_id"
                class="col-lg-2 col-md-3 col-sm-4 col-xs-6 q-mb-md q-mb-sm-none"
              >
                <q-card flat bordered="false" class="full-height q-pa-sm">
                  <q-img
                    fit="contain"
                    :src="data_items[items_id].url_image"
                    class="no-margin"
                    height="150px"
                    loading="lazy"
                  />
                  <q-card-section class="no-margin q-pt-sm q-pb-none">
                    <div class="text-h6 ellipsis q-mb-sm-none q-mb-md-sm">
                      {{ data_items[items_id].item_name }}
                    </div>
                    <div
                      class="text-caption text-weight-medium"
                      v-if="data_items[items_id]"
                    >
                      <template v-if="data_items[items_id].price[0]">
                        <template v-if="data_items[items_id].price[0].discount <= 0">
                          <span class="q-mr-sm"
                            >{{ data_items[items_id].price[0].size_name }}
                            {{ data_items[items_id].price[0].pretty_price }}</span
                          >
                        </template>
                        <template v-else>
                          <span class="q-mr-sm"
                            >{{ data_items[items_id].price[0].size_name }}
                            <del>{{ data_items[items_id].price[0].pretty_price }}</del>
                            {{
                              data_items[items_id].price[0].pretty_price_after_discount
                            }}</span
                          >
                        </template>
                      </template>
                    </div>
                  </q-card-section>

                  <q-card-actions class="q-pa-sm" vertical align="between">
                    <q-btn
                      unelevated
                      rounded
                      color="warning"
                      text-color="black"
                      no-caps
                      class="full-width"
                      label="Add to cart"
                      :dense="$q.screen.lt.sm"
                      :to="{
                        name: 'product',
                        params: {
                          slug: data_items[items_id].slug,
                          cat_id: category.cat_id,
                          item_uuid: data_items[items_id].item_uuid,
                        },
                      }"
                    >
                    </q-btn>
                  </q-card-actions>
                </q-card>
              </div>
              <!-- col  -->
              <!-- item col -->
            </div>
            <!-- row  -->
          </section>
        </template>
        <!-- end loading -->
      </div>
      <!-- col -->
    </div>
    <!-- row -->
  </q-page>
</template>

<style>
@import "@/css/customs.css";
</style>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
import { scroll } from "quasar";
const { getScrollTarget, setVerticalScrollPosition, getVerticalScrollPosition } = scroll;

export default {
  name: "Menu",
  components: {
    CategoryNav: defineAsyncComponent(() => import("components/CategoryNav")),
    SkeletonItem: defineAsyncComponent(() => import("components/SkeletonItem")),
    CategoryDialog: defineAsyncComponent(() => import("components/CategoryDialog")),
  },
  data() {
    return {
      drawer: false,
      data: [],
      data_category: [],
      data_items: [],
      loading: false,
      category_seleted: "",
      itemRefs: [],
      category_position: [],
    };
  },
  mounted() {
    // try {
    //   APIinterface.getLocalID()
    //   this.getMenuCategory()
    // } catch (err) {
    //   this.$router.push('/location')
    // }
  },
  updated() {
    //
  },
  methods: {
    getMenuCategory() {
      this.loading = true;
      APIinterface.geStoreMenu()
        .then((data) => {
          this.data_category = data.details.data.category;
          this.data_items = data.details.data.items;
        })
        .catch((error) => {
          console.debug(error);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    showCategory() {
      this.$refs.category_dialog.show_modal = true;
    },
    afterCategoryselected(id) {
      this.$refs.category_dialog.show_modal = false;
      this.$refs.category_dialog.category = id;
      this.scrollToElement(id);
    },
    setItemRef(el) {
      if (el) {
        this.itemRefs.push(el);
      }
    },
    onScroll(position) {
      //
    },
    scrollToElement(id) {
      const ele = document.getElementById(id);
      const target = getScrollTarget(ele);
      const offset = ele.offsetTop;
      const duration = 500;
      setVerticalScrollPosition(target, offset, duration);
    },
  },
};
</script>
