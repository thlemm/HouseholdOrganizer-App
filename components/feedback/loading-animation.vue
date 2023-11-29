<template>
  <v-card
    width="100%"
    elevation="0"
  >
    <v-card-actions>
      <v-spacer />
      <v-progress-circular
        :size="200"
        :width="7"
        :color="color"
        indeterminate
      />
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: 'LoadingAnimation',

  props: {
    color: {
      type: String,
      required: false,
      default: 'info'
    }
  },

  data () {
    return {}
  }
}
</script>
