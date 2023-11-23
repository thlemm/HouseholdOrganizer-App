<template>
  <v-card
    v-ripple="false"
    class="mb-2"
  >
    <v-card-text>
      <v-img
        :src="imgBaseUrl + item.image"
        width="100%"
        style="max-width: 500px; "
        aspect-ratio="1"
      />
    </v-card-text>
    <v-list-item>
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
        <v-list-item-subtitle class="body-1">
          <v-icon left small>
            {{ mdiMapMarker }}
          </v-icon>
          {{ $t(item.originalRoom.name) }}
        </v-list-item-subtitle>
        <v-list-item-subtitle class="body-1">
          <v-icon left small>
            {{ mdiViewList }}
          </v-icon>
          {{ $t(item.type.name) }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-row class="mx-2">
        <v-col align="center">
          <v-btn
            fab
            x-large
            color="warning"
            @click="reject"
          >
            <v-icon dark>
              mdi-close
            </v-icon>
          </v-btn>
        </v-col>
        <v-spacer />
        <v-col align="center">
          <v-btn
            fab
            x-large
            color="secondary"
            @click="accept"
          >
            <v-icon dark>
              mdi-check
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiMapMarker, mdiViewList } from '@mdi/js'

export default {
  name: 'RankCard',
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
      imgBaseUrl: this.$config.imgBaseUrl
    }
  },
  methods: {
    accept () {
      this.$emit('select-ranking', true)
    },
    reject () {
      this.$emit('select-ranking', false)
    }
  }
}
</script>
