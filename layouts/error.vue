<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col>
        <info-card
          title="Whoops"
          subtitle="Es ist ein Fehler aufgetreten"
          text="Da ging etwas schief."
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-btn
          color="secondary"
          to="/"
        >
          Startseite
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import infoCard from '~/components/info-card.vue'

export default {
  components: { infoCard },
  layout: 'empty',

  props: {
    error: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },

  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
