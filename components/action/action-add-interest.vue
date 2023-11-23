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
      :text="'Soll dein Interesse an dieser Sache wirklich gespeichert werden?'"
      @click-confirm="addInterest()"
      @click-reject="dialog = false"
    />
    <v-btn
      color="neutral"
      rounded
      @click="dialog = true"
    >
      <v-icon color="secondary">
        {{ mdiHeart }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mdiHeart } from '@mdi/js'
import DialogConfirm from '~/components/feedback/dialog-confirm'
import InfoSnackbar from '~/components/feedback/info-snackbar'

export default {
  name: 'ActionAddInterest',
  components: { InfoSnackbar, DialogConfirm },
  props: {
    itemId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      mdiHeart,
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
    async addInterest () {
      const addInterestResponse = await this.addInterestRequest()
      if (addInterestResponse) {
        this.$emit('added-interest')
      } else {
        this.handleError('Interesse konnte nicht aktualisiert werden')
      }
      this.dialog = false
    },
    addInterestRequest () {
      const url = '/api/v2/interest'
      const payload = { item: this.itemId, interested: true }
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
