<template>
  <v-container
    fluid
  >
    <info-snackbar
      :active="snackbar"
      @click-action="snackbar = !snackbar"
    >
      {{ feedbackMessage }}
    </info-snackbar>

    <v-banner
      dark
      class="mb-2"
      elevation="3"
      :icon="mdiCashPlus"
      color="error"
    >
      Casino-Code erstellen
    </v-banner>
  </v-container>
</template>

<script>
import { mdiCashPlus } from '@mdi/js'
import InfoSnackbar from '~/components/feedback/info-snackbar'

export default {

  components: { InfoSnackbar },

  data () {
    return {
      mdiCashPlus,
      snackbar: false,
      feedbackMessage: null
    }
  },
  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=code')
    }
    if (!this.$auth.user.roles.includes('ROLE_ADMIN')) {
      this.$nuxt.$router.replace('/')
    }
  }
}
</script>
