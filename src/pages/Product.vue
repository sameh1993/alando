<template>
  <q-page class="product" padding>
    <q-page-sticky expand position="top">
      <q-toolbar class="bg-white">
        <q-btn
          dense
          flat
          color="dark"
          icon="arrow_back_ios"
          to="/menu"
          no-caps
          label="Back to menu"
        />
      </q-toolbar>
    </q-page-sticky>

    <div class="q-pa-sm"></div>

    <div class="row justify-center q-pa-md">
      <div class="col-md-9 col-12">
        <div class="row justify-center q-col-gutter-md">
          <!-- left item details -->
          <div id="menu" class="col-md-7 col-sm-12 col-xs-12">
            <ProductSkeletonLeft v-if="loading" />

            <template v-else>
              <div class="add float-right q-mb-xs">
                <Favs
                  ref="favs"
                  :item_token="items.item_token"
                  :cat_id="items.cat_id"
                  :active="items.save_item"
                  @after-savefav="afterSavefav(items)"
                />
              </div>

              <q-img fit="fil" :src="items.url_image" class="no-margin" />

              <h5 class="text-weight-bold q-pt-sm q-pb-sm">{{ items.item_name }}</h5>

              <p class="no-margin font12 text-weight-bold">Special Instructions</p>
              <q-input
                v-model="special_instructions"
                autogrow
                outlined
                class="q-mb-md full-width"
                color="warning"
              />

              <!-- quantity -->
            </template>
          </div>
          <!-- col -->

          <!-- right item addon details -->
          <div class="col-md-7 col-sm-12 col-xs-12">
            <q-card flat class="fit">
              <q-card-section>
                <ProductSkeletonRight v-if="loading" />
                <template v-else>
                  <h5 class="text-weight-bold">Customize your Order</h5>

                  <q-option-group
                    v-model="item_size_id"
                    :options="size_data"
                    color="warning"
                    inline
                  />

                  <h5 v-if="cooking_data.length > 0" class="text-weight-bold">
                    Cooking Reference
                  </h5>
                  <q-option-group
                    v-model="cooking_ref"
                    :options="cooking_data"
                    color="warning"
                    inline
                  />

                  <h5 v-if="ingredients_data.length > 0" class="text-weight-bold">
                    Ingredients
                  </h5>
                  <q-option-group
                    v-model="ingredients"
                    :options="ingredients_data"
                    color="warning"
                    inline
                    type="checkbox"
                  />

                  <template v-if="addons[item_size_id]">
                    <template
                      v-for="addons in addons[item_size_id]"
                      :key="addons.subcat_id"
                    >
                      <!-- addons -->
                      <h5 class="text-weight-bold q-mb-none q-mb-xs">
                        {{ addons.subcategory_name }}
                      </h5>
                      <div class="row justify-between bg-grey-1 q-pa-sm">
                        <p
                          v-if="addons.multi_option === 'one'"
                          class="col no-margin q-pr-sm font12"
                        >
                          Select 1
                        </p>
                        <p
                          v-else-if="addons.multi_option === 'multiple'"
                          class="col no-margin q-pr-sm font12"
                        >
                          Choose up to {{ addons.sub_items.length }}
                        </p>
                        <p
                          v-else-if="addons.multi_option === 'custom'"
                          class="col no-margin q-pr-sm font12"
                        >
                          Choose up to {{ addons.multi_option_value }}
                        </p>

                        <p
                          v-if="addons.require_addon == 1"
                          class="col no-margin font12 text-right"
                        >
                          <span class="bg-yellow-11 q-pa-xs rounded-borders"
                            >Required</span
                          >
                        </p>
                        <p v-else class="col no-margin font12 text-right">(Optional)</p>
                      </div>

                      <div
                        class="row q-gutter-none addon-carousel q-mt-md q-col-gutter-sm"
                      >
                        <div
                          v-for="sub_items in addons.sub_items"
                          :key="sub_items.sub_item_id"
                          class="col-lg-3 col-md-3 col-sm-6 col-xs-6 text-center"
                        >
                          <q-card flat class="column items-center full-height">
                            <template v-if="addons.multi_option === 'one'">
                              <q-radio
                                v-model="addons.sub_items_checked"
                                :val="sub_items.sub_item_id"
                                label=""
                              >
                                <q-avatar size="80px" square class="col self-center">
                                  <q-img
                                    fit="contain"
                                    :src="
                                      sub_items.hasimage
                                        ? sub_items.url_image
                                        : 'default-addon.png'
                                    "
                                    class="no-margin"
                                    height="80px"
                                    loading="lazy"
                                  />
                                </q-avatar>
                              </q-radio>
                            </template>

                            <template v-else-if="addons.multi_option === 'multiple'">
                              <div>
                                <q-avatar size="80px" square class="col self-center">
                                  <q-img
                                    fit="contain"
                                    :src="sub_items.url_image"
                                    class="no-margin"
                                    height="80px"
                                    loading="lazy"
                                  />
                                </q-avatar>
                              </div>
                            </template>

                            <template v-else-if="addons.multi_option === 'custom'">
                              <q-checkbox
                                v-model="sub_items.checked"
                                :val="sub_items.sub_item_id"
                                label=""
                                :disable="sub_items.disabled"
                              >
                                <q-avatar size="80px" square class="col self-center">
                                  <q-img
                                    fit="contain"
                                    :src="sub_items.url_image"
                                    class="no-margin"
                                    height="80px"
                                    loading="lazy"
                                  />
                                </q-avatar>
                              </q-checkbox>
                            </template>

                            <p
                              class="font12 q-mt-sm q-mb-none col ellipsis-2-lines line-height-normal q-pb-sm"
                            >
                              {{ sub_items.sub_item_name }}
                            </p>
                            <p class="font12 no-margin col q-mt-sm">
                              {{ sub_items.pretty_price }}
                            </p>

                            <!-- multiple button -->
                            <div
                              v-if="addons.multi_option === 'multiple'"
                              class="col-auto w-75 q-mt-xs"
                            >
                              <div
                                v-if="sub_items.checked == true"
                                class="row items-center justify-center"
                              >
                                <div class="col no-padding text-center">
                                  <q-btn
                                    @click="
                                      sub_items.qty > 1
                                        ? sub_items.qty--
                                        : (sub_items.checked = false)
                                    "
                                    round
                                    unelevated
                                    dense
                                    size="11px"
                                    color="warning"
                                    icon="remove"
                                  />
                                </div>
                                <div class="col no-padding text-center">
                                  {{ sub_items.qty }}
                                </div>
                                <div class="col no-padding text-center">
                                  <q-btn
                                    @click="sub_items.qty++"
                                    round
                                    unelevated
                                    dense
                                    size="11px"
                                    color="warning"
                                    icon="add"
                                  />
                                </div>
                              </div>
                              <div v-else>
                                <q-btn
                                  @click="sub_items.checked = true"
                                  round
                                  unelevated
                                  dense
                                  size="11px"
                                  color="grey-4"
                                  icon="add"
                                />
                              </div>
                            </div>
                            <!-- multiple button -->
                          </q-card>
                        </div>
                        <!-- col -->
                      </div>
                      <!-- row -->

                      <!-- addons -->
                    </template>
                    <!-- v-for="addons in addons[item_size_id]" -->
                  </template>
                  <!-- v-if="addons[item_size_id]" -->
                </template>
                <!--  end loading -->
              </q-card-section>
            </q-card>
          </div>
          <!-- col -->

          <div class="col-md-7 col-sm-12 col-xs-12">
            <div class="content">
              <div class="row items-center justify-center">
                <div class="col-sm-6 col-8 no-padding">
                  <div class="text-h5 no-margin text-weight-bold">
                    {{ item_total }}
                  </div>
                </div>
                <div class="col-sm-6 col-4">
                  <div class="row items-center justify-center">
                    <div class="col no-padding text-center">
                      <q-btn
                        @click="item_qty > 1 ? item_qty-- : 1"
                        round
                        unelevated
                        dense
                        size="11px"
                        color="warning"
                        icon="remove"
                      />
                    </div>
                    <div class="col no-padding text-center">{{ item_qty }}</div>
                    <div class="col no-padding text-center">
                      <q-btn
                        @click="item_qty++"
                        round
                        unelevated
                        dense
                        size="11px"
                        color="warning"
                        icon="add"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- quantity -->

              <div class="q-mt-md q-mb-md">
                <q-btn
                  unelevated
                  rounded
                  color="warning"
                  text-color="black"
                  no-caps
                  class="full-width"
                  :disable="disabled_cart"
                  label="Add to cart"
                  :dense="$q.screen.lt.sm"
                  @click="AddToCart()"
                  :loading="loading_add"
                >
                </q-btn>
              </div>
            </div>
          </div>
        </div>
        <!-- row -->

        <!-- more items -->
        <SimilarItems
          class="q-mt-lg"
          ref="similar_items"
          title="More similar items"
          bg="bg-mygrey"
        />
        <!-- more items -->
      </div>
      <!-- col -->
    </div>
    <!-- row -->
  </q-page>
</template>

<style lang="scss" scoped>
@import "src/css/rules.scss";

.product {
  .q-option-group {
    display: flex;
    flex-direction: column;
  }

  @include maxScreen(sm) {
    .add {
      margin-bottom: 20px;
    }
  }

  #menu {
    margin-top: 0;
  }

  body.screen--xs .q-btn.btn-icon {
    margin-bottom: 20px;
  }

  .q-img {
    height: 254px;

    @include maxScreen(sm) {
      height: 144 !important;
    }
    img {
      object-fit: fill !important;
    }
  }
}
</style>

<script>
import { defineAsyncComponent } from "vue";
import APIinterface from "src/api/APIinterface";
// import { Money3Component } from 'v-money3'
import { format } from "v-money3";

const empty = function (data) {
  if (
    typeof data === "undefined" ||
    data === null ||
    data === "" ||
    data === "null" ||
    data === "undefined"
  ) {
    return true;
  }
  return false;
};

export default {
  name: "Product",
  components: {
    SimilarItems: defineAsyncComponent(() => import("components/SimilarItems")),
    Favs: defineAsyncComponent(() => import("components/Favs")),
    ProductSkeletonLeft: defineAsyncComponent(() =>
      import("components/ProductSkeletonLeft")
    ),
    ProductSkeletonRight: defineAsyncComponent(() =>
      import("components/ProductSkeletonRight")
    ),
    // money3: Money3Component
  },
  data() {
    return {
      // router: useRouter(),
      loading: false,
      loading_add: false,
      item_qty: 1,
      items: [],
      item_size_id: 0,
      size_data: [],
      size_datas: [],
      cooking_ref: 0,
      cooking_data: [],
      ingredients: [],
      ingredients_data: [],
      addons: {},
      special_instructions: "",
      transaction_type: "",
      if_sold_out: "",
      sold_out_options: [],
      item_total: 0,
      disabled_cart: true,
      slide_items: 0,
      favorites: [],
      config: [],
    };
  },
  mounted() {
    try {
      APIinterface.getLocalID();
      this.getMenuItem();
    } catch (err) {
      this.$router.push("/location");
    }
  },
  updated() {
    this.resetData();
    this.getMenuItem();
  },
  watch: {
    addons: {
      handler(newValue, oldValue) {
        this.ItemSummary();
      },
      deep: true,
    },
    item_size_id() {
      this.ItemSummary();
    },
    cooking_ref() {
      this.ItemSummary();
    },
    ingredients() {
      this.ItemSummary();
    },
    item_qty() {
      this.ItemSummary();
    },
  },
  methods: {
    resetData() {
      this.item_qty = 1;
      this.items = [];
      this.item_size_id = 0;
      this.size_data = [];
      this.size_datas = [];
      this.cooking_ref = 0;
      this.cooking_data = [];
      this.ingredients = [];
      this.ingredients_data = [];
      this.addons = {};
      this.special_instructions = "";
      this.transaction_type = "";
      this.if_sold_out = "";
      this.sold_out_options = [];
      this.item_total = 0;
      this.disabled_cart = true;
      this.slide_items = 0;
    },
    getMenuItem() {
      this.loading = true;
      APIinterface.getMenuItem(this.$route.params.cat_id, this.$route.params.item_uuid)
        .then((data) => {
          this.config = data.details.config;
          this.items = data.details.data.items;
          this.size_datas = data.details.data.items.price;
          const soldOutData = data.details.sold_out_options;

          this.if_sold_out = data.details.default_sold_out_options;

          const prices = data.details.data.items.price;
          const metaCookingRef = data.details.data.meta
            ? data.details.data.meta.cooking_ref
            : {};
          const metaCookingRefDetails = data.details.data.meta
            ? data.details.data.meta_details.cooking_ref
            : {};

          const metaIngredients = data.details.data.meta
            ? data.details.data.meta.ingredients
            : {};
          const metaIngredientsDetails = data.details.data.meta
            ? data.details.data.meta_details.ingredients
            : {};

          const addons = data.details.data ? data.details.data.addons : {};
          const addonItems = data.details.data ? data.details.data.addon_items : {};

          if (Object.keys(soldOutData).length > 0) {
            Object.entries(soldOutData).forEach(([itemSoldKey, itemsSoldData]) => {
              this.sold_out_options.push({ label: itemsSoldData, value: itemSoldKey });
            });
          }

          if (Object.keys(prices).length > 0) {
            Object.entries(prices).forEach(([key, items]) => {
              if (items.discount <= 0) {
                this.size_data.push({
                  label: items.size_name + " " + items.pretty_price,
                  value: items.item_size_id,
                });
              } else {
                this.size_data.push({
                  label: items.size_name + " " + items.pretty_price_after_discount,
                  value: items.item_size_id,
                });
              }
            });
            this.item_size_id = parseInt(Object.keys(prices)[0]);
          }

          if (metaCookingRef.length > 0) {
            Object.entries(metaCookingRef).forEach(([key, value]) => {
              this.cooking_data.push({
                label: metaCookingRefDetails[value].meta_name,
                value: metaCookingRefDetails[value].meta_id,
              });
            });
          }

          if (metaIngredients.length > 0) {
            Object.entries(metaIngredients).forEach(([key, value]) => {
              this.ingredients_data.push({
                label: metaIngredientsDetails[value].meta_name,
                value: metaIngredientsDetails[value].meta_id,
              });
            });
          }

          // addons
          // const addonsData = []
          if (Object.keys(addons).length > 0) {
            Object.entries(addons).forEach(([sizeId, Subcat]) => {
              const addOnsAdded = [];
              Object.entries(Subcat).forEach(([key, child]) => {
                const subItems = [];
                Object.entries(child.sub_items).forEach(([key2, subItemsID]) => {
                  if (addonItems[subItemsID]) {
                    const subItemsAdd = addonItems[subItemsID];
                    addonItems[subItemsID].checked = false;
                    addonItems[subItemsID].disabled = false;
                    addonItems[subItemsID].qty = 1;
                    subItems.push(subItemsAdd);
                  }
                });

                const subdata = {
                  subcat_id: child.subcat_id,
                  subcategory_name: child.subcategory_name,
                  subcategory_description: child.subcategory_description,
                  multi_option: child.multi_option,
                  multi_option_value: child.multi_option_value,
                  require_addon: child.require_addon,
                  pre_selected: child.pre_selected,
                  sub_items_checked: "",
                  sub_items: subItems,
                };
                addOnsAdded.push(subdata);
              });
              this.addons[sizeId] = addOnsAdded;
            });
          }
          //
        })
        .catch((error) => {
          console.debug(error);
        })
        .then((data) => {
          this.loading = false;
        });
    },
    ItemSummary() {
      let $itemTotal = 0;
      const $requiredAddon = [];
      const $requiredAddonAdded = [];

      if (!empty(this.size_datas[this.item_size_id])) {
        const item = this.size_datas[this.item_size_id];
        if (item.discount > 0) {
          $itemTotal += this.item_qty * parseFloat(item.price_after_discount);
        } else $itemTotal += this.item_qty * parseFloat(item.price);
      }

      if (!empty(this.addons[this.item_size_id])) {
        this.addons[this.item_size_id].forEach((item, index) => {
          if (item.require_addon === "1") {
            $requiredAddon.push(item.subcat_id);
          }

          if (item.multi_option === "custom") {
            let totalCheck = 0;
            const multiOptionValue = item.multi_option_value;
            const itemIndex = [];
            const itemIndex2 = [];
            item.sub_items.forEach((item2, index2) => {
              if (item2.checked === true) {
                totalCheck++;
                $itemTotal += this.item_qty * parseFloat(item2.price);
                $requiredAddonAdded.push(item.subcat_id);
              } else itemIndex.push(index2);

              if (item2.disabled === true) {
                itemIndex2.push(index2);
              }
            });

            if (totalCheck >= multiOptionValue) {
              itemIndex.forEach((item3, index3) => {
                item.sub_items[item3].disabled = true;
              });
            } else {
              itemIndex2.forEach((item3, index3) => {
                item.sub_items[item3].disabled = false;
              });
            }
          } else if (item.multi_option === "one") {
            item.sub_items.forEach((item2, index2) => {
              if (item2.sub_item_id === item.sub_items_checked) {
                $itemTotal += this.item_qty * parseFloat(item2.price);
                $requiredAddonAdded.push(item.subcat_id);
              }
            });
          } else if (item.multi_option === "multiple") {
            item.sub_items.forEach((item2, index2) => {
              if (item2.checked === true) {
                $itemTotal += item2.qty * parseFloat(item2.price);
                $requiredAddonAdded.push(item.subcat_id);
              }
            });
          } /* endif custom */
        });
        // end loop addons
      }

      this.item_total = format($itemTotal, this.config);

      let $requiredMeet = true;
      if ($requiredAddon.length > 0) {
        $requiredAddon.forEach((requiedItem, requiredIndex) => {
          if ($requiredAddonAdded.includes(requiedItem) === false) {
            $requiredMeet = false;
            return false;
          }
        });
      }

      if ($requiredMeet) {
        this.disabled_cart = false;
      } else this.disabled_cart = true;
    },
    AddToCart() {
      const $ingredients = [];
      if (this.ingredients.length > 0) {
        this.ingredients.forEach((ingredientsId, index) => {
          $ingredients.push({ meta_id: ingredientsId, checked: true, meta_name: "" });
        });
      }

      const $meta = {
        cooking_ref: [
          { meta_id: this.cooking_ref, checked: this.cooking_ref, meta_name: "" },
        ],
        ingredients: $ingredients,
      };
      const $cartUuid = APIinterface.getStorage("cart_uuid");
      const $data = {
        cart_uuid: $cartUuid,
        cat_id: this.$route.params.cat_id,
        item_size_id: this.item_size_id,
        item_token: this.$route.params.item_uuid,
        item_qty: this.item_qty,
        special_instructions: this.special_instructions,
        if_sold_out: this.if_sold_out.value,
        transaction_type: "delivery",
        meta: $meta,
        item_addons: !empty(this.addons[this.item_size_id])
          ? this.addons[this.item_size_id]
          : [],
      };

      this.loading_add = true;
      APIinterface.AddToCart($data)
        .then((data) => {
          if (empty($cartUuid)) {
            APIinterface.setStorage("cart_uuid", data.details.cart_uuid);
          }
          this.$router.push({ name: "menu", params: { addcart: true } });
        })
        .catch((error) => {
          APIinterface.notify("negative", error, "error_outline", this.$q);
        })
        .then((data) => {
          this.loading_add = false;
        });
    },
    afterSavefav(item) {
      item.save_item = !item.save_item;
    },
  },
};
</script>
