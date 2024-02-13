<template>
  <v-container
    fluid
    class="text-center"
  >
    <br>
    <v-progress-circular
      class="mt-8"
      :size="230"
      :width="30"
      :color="color_1"
      rotate="180"
      indeterminate
    >
      <v-progress-circular
        :size="180"
        :width="30"
        :color="color_2"
        indeterminate
      >
        <v-progress-circular
          :size="130"
          :width="30"
          :color="color_3"
          rotate="90"
          indeterminate
        >
          <v-progress-circular
            :size="80"
            :width="30"
            :color="color_4"
            rotate="270"
            indeterminate
          >
          </v-progress-circular>
        </v-progress-circular>
      </v-progress-circular>
    </v-progress-circular>
  </v-container>
</template>

<script>
export default {

  data () {
    return {
      color_1: 'info',
      color_2: 'warning',
      color_3: 'primary',
      color_4: 'secondary',
      run: true,
      colors: ['info', 'warning', 'primary', 'secondary', 'error']
    }
  },

  mounted () {
    this.changeAnimationColors(0)
  },

  methods: {
    changeAnimationColors (i) {
      this.color_1 = this.colors[this.normalizeIndex(i)]
      this.color_2 = this.colors[this.normalizeIndex(i + 1)]
      this.color_3 = this.colors[this.normalizeIndex(i + 2)]
      this.color_4 = this.colors[this.normalizeIndex(i + 3)]
      if (i < 3) {
        i++
      } else {
        i = 0
      }
      if (this.run) {
        setTimeout(() => (this.changeAnimationColors(i)), 500)
      }
    },
    normalizeIndex (i) {
      return i < 4 ? i : (i - 4)
    }
  }
}
</script>
