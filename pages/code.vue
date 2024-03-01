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
    <v-row>
      <v-col class="text-center">
        <v-btn
          class="mt-8"
          :disabled="loading"
          color="error"
          @click="getCasinoCode"
        >
          Code generieren
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center">
        <v-otp-input
          v-model="code"
          class="ml-1 mr-1 mt-8"
          length="6"
          type="number"
          readonly
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center">
        <v-btn
          v-if="code !== ''"
          class="mt-0"
          :disabled="loading"
          @click="copyToClipboard"
        >
          Kopieren
        </v-btn>
      </v-col>
    </v-row>
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
      feedbackMessage: null,
      loading: false,
      code: ''
    }
  },
  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=code')
    }
    if (!this.$auth.user.roles.includes('ROLE_ADMIN')) {
      this.$nuxt.$router.replace('/')
    }
  },
  methods: {
    async getCasinoCode () {
      this.loading = true
      const getCasinoCodeResponse = await this.getCasinoCodeRequest()
      if (getCasinoCodeResponse) {
        this.loading = false
        this.code = getCasinoCodeResponse.message
      }
    },
    getCasinoCodeRequest () {
      const url = '/api/v2/code/new'
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve) {
        _this.$axios.get(url, config)
          .then((response) => {
            if (response.status === 200) {
              resolve(response.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => {
            resolve(false)
          })
      })
    },
    copyToClipboard () {
      navigator.clipboard.writeText(this.code)
      this.feedbackMessage = 'Code kopiert!'
      this.snackbar = true
    }
  }
}
</script>
