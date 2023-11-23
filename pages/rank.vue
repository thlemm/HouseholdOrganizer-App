<template>
  <v-layout
    column
    justify-center
    align-center
  >
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
        :icon="mdiThumbsUpDown"
        color="primary"
      >
        Neue Sachen bewerten
      </v-banner>
      <info-card
        v-if="(item === undefined || item === '') && loading === false"
        title="Nicht gefunden"
        subtitle="Es wurden noch keine neuen Sachen in den Katalog eingetragen. Versuche es später nocheinmal."
      />
      <loading-animation
        v-if="loading"
        color="secondary"
      />
      <rank-card
        v-if="item && loading === false"
        :item="item"
        @select-ranking="onSelectedRanking($event)"
      />
    </v-container>
  </v-layout>
</template>

<script>
import { mdiThumbsUpDown } from '@mdi/js'
import LoadingAnimation from '~/components/feedback/loading-animation'
import InfoSnackbar from '~/components/feedback/info-snackbar'

export default {
  name: 'Rank',
  components: { InfoSnackbar, LoadingAnimation },
  layout: 'default',

  data () {
    return {
      mdiThumbsUpDown,
      show: null,
      notification: false,
      item: undefined,
      snackbar: false,
      feedbackMessage: null,
      loading: false
    }
  },
  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=rank')
    }
    this.getNextNotAssessedItem()
  },
  methods: {
    async onSelectedRanking (value) {
      this.loading = true
      const sendRankingResponse = await this.sendRankingRequest(value)
      if (sendRankingResponse) {
        await this.getNextNotAssessedItem()
      }
    },
    handleError (feedbackMessage) {
      this.snackbar = true
      this.feedbackMessage = feedbackMessage
      this.loading = false
    },
    sendRankingRequest (value) {
      const url = '/api/v2/interest'
      const payload = { item: this.item.id, interested: value }
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve) {
        _this.$axios.post(url, payload, config)
          .then((response) => {
            if (response.status === 201) {
              resolve(true)
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
    },
    async getNextNotAssessedItem () {
      if (this.$auth.loggedIn) {
        this.loading = true
        const getNextNotAssessedItemResponse = await this.getNextNotAssessedItemRequest()
        if (getNextNotAssessedItemResponse || getNextNotAssessedItemResponse === '') {
          this.item = getNextNotAssessedItemResponse
        } else {
          this.snackbar = true
          this.handleError('Fehler bei Abfrage der Daten')
        }
        this.loading = false
      } else {
        this.snackbar = true
        this.handleError('Du bist nicht korrekt eingeloggt')
      }
    },
    getNextNotAssessedItemRequest () {
      const url = '/api/v2/items/notassessed'
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
