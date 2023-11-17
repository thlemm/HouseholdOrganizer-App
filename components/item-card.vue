<template>
  <v-card
    v-ripple="false"
    class="mb-2"
  >
    <v-list-item two-line @click="show = !show">
      <v-list-item-avatar
        tile
        size="80"
        color="grey"
      >
        <v-img :src="imgBaseUrl + item.image" />
      </v-list-item-avatar>
      <v-list-item-content class="mx-0">
        <v-list-item-title class="title">
          <v-chip
            v-for="tag in item.tags"
            :key="tag.id"
            class="mr-1"
            small
            label
          >
            {{ tag.tag }}
          </v-chip>
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-icon left small>
            {{ mdiMapMarker }}
          </v-icon>
          {{ $t(item.originalRoom.name) }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon left small>
            {{ mdiViewList }}
          </v-icon>
          {{ $t(item.type.name) }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon left small>
            {{ item.interests.length > 0 ? mdiAccountAlert : '' }}
          </v-icon>
          <v-chip
            v-for="interest in item.interests"
            :key="interest.id"
            class="mr-1"
            color="warning"
            x-small
          >
            {{ interest.user.username }}
          </v-chip>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-expand-transition>
      <div v-show="show">
        <v-list-item>
          <v-list-item-content class="mx-0">
            <v-list-item-subtitle class="body-1 font-weight-black">
              Lagerort
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-1">
              Raum: {{ item.currentRoom ? $t(item.currentRoom.name) : '---' }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-1">
              Kiste/Regal: {{ item.location }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-1">
              Teilenummer: {{ item.mark }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="mt-2 font-weight-black">
              Schlagworte:
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-2">
              <v-chip
                v-for="tag in item.tags"
                :key="tag.id"
                class="mr-1"
                small
                label
              >
                {{ tag.tag }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-card-text>
          <v-img
            :src="imgBaseUrl + item.image"
            width="100%"
            style="max-width: 500px; "
            aspect-ratio="1"
          />
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { mdiMapMarker, mdiViewList, mdiAccountAlert } from '@mdi/js'

export default {
  name: 'ItemCard',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      mdiMapMarker,
      mdiViewList,
      mdiAccountAlert,
      imgBaseUrl: this.$config.imgBaseUrl,
      show: false
    }
  }
}
</script>
