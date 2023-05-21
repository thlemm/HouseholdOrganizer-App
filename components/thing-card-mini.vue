<template>
  <v-card
    v-ripple="false"
    class="mx-1"
    max-width="100px"
    @click="toggle"
    style="float:left"
  >
    <v-list-item-avatar
      tile
      size="100"
      color="grey"
    >
      <v-img :src="'http://localhost/pics/' + picture" />
    </v-list-item-avatar>
  </v-card>
</template>

<script>
export default {
  name: 'ThingCardMini',
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
