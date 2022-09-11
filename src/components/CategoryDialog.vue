<template>
  <q-dialog
    v-model="show_modal"
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-white text-dark">
      <q-toolbar class="text-primary top-toolbar" dense>
        <q-btn flat round dense icon="close" color="dark" @click="show_modal = !true" />
        <q-toolbar-title class="font12 text-dark"> Menu </q-toolbar-title>
      </q-toolbar>
      <q-separator />

      <q-card-section>
        <q-list dense>
          <q-item
            @click="$emit('afterCategoryselected', items.category_uiid)"
            v-for="items in data"
            :key="items.cat_id"
            :active="category == items.category_uiid ? true : false"
            clickable
            v-ripple
            class="text-weight-thin font12 pl-0 pr-0"
            active-class="text-dark text-weight-600"
          >
            <q-item-section>
              <q-item-label>{{ items.category_name }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-weight-600">
                <q-avatar color="grey-2" text-color="dark" size="sm">
                  {{ items.items.length }}
                </q-avatar>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "CategoryDialog",
  props: ["data"],
  data() {
    return {
      show_modal: false,
      category: "",
    };
  },
};
</script>
