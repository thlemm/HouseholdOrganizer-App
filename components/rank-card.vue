<template>
  <v-card
    v-ripple="false"
    class="mb-2"
  >
    <v-card-text>
      <v-img
        :src="'../pics/' + picture"
        width="100%"
        style="max-width: 500px; "
        aspect-ratio="1"
      />
    </v-card-text>
    <v-list-item>
      <v-list-item-content class="mx-0">
        <v-list-item-title class="title">
          {{ tags }}
        </v-list-item-title>
        <v-list-item-subtitle class="body-1">
          <v-icon left small> mdi-map-marker </v-icon>
          {{ room }}
        </v-list-item-subtitle>
        <v-list-item-subtitle class="body-1">
          <v-icon left small> mdi-view-list </v-icon>
          {{ type }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-row class="mx-2">
        <v-col align="center">
          <v-btn
            fab
            x-large
            color="complementary"
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
            color="primaryLight"
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
export default {
  name: 'RankCard',
  props: {
    tags: {
      type: String,
      required: true,
      default: ''
    },
    room: {
      type: String,
      required: true,
      default: ''
    },
    type: {
      type: String,
      required: true,
      default: ''
    },
    picture: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {

    }
  },
  methods: {
    accept () {
      this.$nuxt.$emit('accept-thing')
    },
    reject () {
      this.$nuxt.$emit('reject-thing')
    }
  }
}
</script>
