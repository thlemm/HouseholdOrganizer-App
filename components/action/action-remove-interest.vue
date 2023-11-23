<template>
  <div>
    <info-snackbar
      :active="snackbar"
      @click-action="snackbar = !snackbar"
    >
      {{ feedbackMessage }}
    </info-snackbar>
    <dialog-confirm
      :active="dialog"
      :text="'Soll dein Interesse an dieser Sache wirklich gelöscht werden?'"
      @click-confirm="removeInterest()"
      @click-reject="dialog = false"
    />
    <v-btn
      color="neutral"
      rounded
      @click="dialog = true"
    >
      <v-icon color="warning">
        {{ mdiHeartOff }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mdiHeartOff } from '@mdi/js'
import DialogConfirm from '~/components/feedback/dialog-confirm'
import InfoSnackbar from '~/components/feedback/info-snackbar'

export default {
  name: 'ActionRemoveInterest',
  components: { InfoSnackbar, DialogConfirm },
  props: {
    interestId: {
      type: Number,
      required: true
    },
    itemId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      mdiHeartOff,
      dialog: false,
      snackbar: false,
      feedbackMessage: null
    }
  },
  methods: {
    handleError (feedbackMessage) {
      this.snackbar = true
      this.feedbackMessage = feedbackMessage
    },
    async removeInterest () {
      const removeInterestResponse = await this.removeInterestRequest()
      if (removeInterestResponse) {
        const addInterestResponse = await this.addInterestRequest()
        if (addInterestResponse) {
          this.$emit('removed-interest')
        }
        this.handleError('Interesse konnte nicht aktualisiert werden')
      } else {
        this.handleError('Interesse konnte nicht gelöscht werden')
      }
      this.dialog = false
    },
    removeInterestRequest () {
      const url = '/api/v2/interest/' + this.interestId
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve) {
        _this.$axios.delete(url, config)
          .then((response) => {
            if (response.status === 200) {
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
    addInterestRequest () {
      const url = '/api/v2/interest'
      const payload = { item: this.itemId, interested: false }
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
    }
  }
}
</script>
