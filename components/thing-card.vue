<template>
  <v-card
    v-ripple="false"
    class="mb-2"
    @click="toggle"
  >
    <v-list-item two-line>
      <v-list-item-avatar
        tile
        size="80"
        color="grey"
      >
        <v-img :src="'../pics/' + picture" />
      </v-list-item-avatar>
      <v-list-item-content class="mx-0">
        <v-list-item-title class="title">
          {{ tags }}
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-icon left small> mdi-map-marker </v-icon>
          {{ room }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon left small> mdi-view-list </v-icon>
          {{ type }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon left small> mdi-account-alert </v-icon>
          <v-chip
            v-for="user in interest"
            :key="user"
            x-small
            >{{ user }}</v-chip>
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
              Raum: {{ location }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-1">
              Kiste/Regal: {{ boxId }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-1">
              Teilenummer: {{ thingId }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="mt-2 font-weight-black">
              Schlagworte:
            </v-list-item-subtitle>
            <v-list-item-subtitle class="body-2">
              {{ tags }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-card-text>
          <v-img
            :src="'../pics/' + picture"
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
export default {
  name: 'ThingCard',
  props: {
    thingId: {
      type: String,
      required: true,
      default: ''
    },
    tags: {
      type: String,
      required: true,
      default: ''
    },
    location: {
      type: String,
      required: true,
      default: ''
    },
    boxId: {
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
    },
    user: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      show: false,
      interest: undefined
    }
  },
  created () {
    this.$nuxt.$on('close-question-expanse', () => {
      this.show = false
    })

    this.interest = this.user.slice(0, -1).split(',')
    if (this.interest[0] === '') {
      this.interest[0] = 'keine Interessenten'
    }
    // console.log(this.interest)
  },
  beforeDestroy () {
    this.$nuxt.$off('close-question-expanse')
  },
  methods: {
    toggle () {
      if (this.show === true) {
        this.show = false
      } else {
        this.$nuxt.$emit('close-question-expanse')
        this.show = true
      }
    }
  }
}
</script>
