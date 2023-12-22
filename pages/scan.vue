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
      :icon="mdiArchiveSearch"
      color="primary"
    >
      Kiste Durchleuchten
    </v-banner>
    <info-card
      title="Nummer eingeben"
      subtitle="Hier kann die Nummer der Kiste oder des Regals eingegeben werden, dass gescannt werden soll."
    />
    <v-form v-model="isFormValid">
      <v-row>
        <v-col align="center">
          <v-col
            cols="5"
          >
            <v-text-field
              v-model="input.location"
              class="mt-4 mb-2"
              :rules="[rules.required, rules.location]"
              type="number"
              outlined
              dense
              label="Nummer"
              hide-details
            />
          </v-col>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="text-center">
          <v-btn
            :disabled="!isFormValid || loading"
            color="secondary"
            @click="scan"
          >
            Durchleuchten
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-divider class="mt-3 mb-0" />
    <span class="mt-0 pt-0 mb-5 grey--text">{{ items.length }} Ergebnisse gefunden:</span>
    <loading-animation
      v-if="loading"
      color="secondary"
    />
    <div v-if="lazy">
      <v-lazy
        v-for="(item, i) in items"
        :key="i"
        :options="{
          threshold: .5
        }"
        class="fill-height"
        transition="fade-transition"
        @input="countLoadingEvents()"
      >
        <item-card
          :item="item"
          :action-toggle-interest="true"
          :filter-interests="false"
          @reload-data="scan"
        />
      </v-lazy>
    </div>
  </v-container>
</template>

<script>
import { mdiArchiveSearch } from '@mdi/js'
import InfoSnackbar from '~/components/feedback/info-snackbar'
import LoadingAnimation from '~/components/feedback/loading-animation'
export default {
  name: 'Scan',
  components: { LoadingAnimation, InfoSnackbar },
  layout: 'default',

  data () {
    return {
      mdiArchiveSearch,
      alert: false,
      message: '',
      loader: null,
      loading: false,
      input: {
        location: null
      },
      isFormValid: false,
      rules: {
        required: (value) => { return !!value || 'Bitte eingeben.' },
        location: (value) => {
          const pattern = /^[0-9]*$/
          return pattern.test(value) || 'Zahl eingeben.'
        }
      },
      items: [],
      snackbar: false,
      feedbackMessage: null,
      eventsCounter: 0,
      eventLimit: 0,
      lazy: true
    }
  },
  watch: {
    loader () {
      this.loading = true
      setTimeout(() => (this.timeout()), 10000)
      this.loader = null
    }
  },
  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=scan')
    }
  },
  methods: {
    countLoadingEvents () {
      this.eventsCounter += 1
      if (this.eventsCounter === this.eventLimit) {
        this.loading = false
      }
    },
    async scan () {
      if (this.$auth.loggedIn) {
        this.items = []
        this.lazy = false
        this.eventsCounter = 0
        this.loading = true
        const response = await this.getRequest()
        if (response) {
          this.items = response
          this.eventLimit = this.items.length
          this.lazy = true
        } else {
          this.items = []
          this.snackbar = true
          this.handleError('Fehler bei Abfrage der Daten')
        }
      }
    },
    handleError (feedbackMessage) {
      this.snackbar = true
      this.feedbackMessage = feedbackMessage
      this.loading = false
    },
    getRequest () {
      const url = '/api/v2/items/location/' + this.input.location
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
          .catch((err) => {
            if (err.message === 'Network Error') {
              _this.handleError('Server nicht erreichbar')
            } else {
              _this.handleError('Unerwarteter Fehler')
            }
            resolve(false)
          })
      })
    }
  }
}
</script>
