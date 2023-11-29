<template>
  <div style="float:right;">
    <info-snackbar
      :active="snackbar"
      @click-action="snackbar = !snackbar"
    >
      {{ feedbackMessage }}
    </info-snackbar>
    <dialog-confirm
      :active="dialog"
      :text="'Soll dein Interesse an dieser Sache wirklich gelöscht werden?'"
      @click-confirm="toggleInterest()"
      @click-reject="dialog = false"
    />
    <v-btn
      class="mr-1"
      color="neutral"
      rounded
      @click="onClickButton()"
    >
      <v-icon color="warning">
        {{ isInterested ? mdiHeart : mdiHeartOutline }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mdiHeart, mdiHeartOutline, mdiHeartOff } from '@mdi/js'
import DialogConfirm from '~/components/feedback/dialog-confirm'
import InfoSnackbar from '~/components/feedback/info-snackbar'

export default {
  name: 'ActionToggleInterest',
  components: { InfoSnackbar, DialogConfirm },
  props: {
    interestId: {
      type: Number,
      required: false,
      default: 0
    },
    isInterested: {
      type: Boolean,
      required: false,
      default: false
    },
    itemId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      mdiHeart,
      mdiHeartOutline,
      mdiHeartOff,
      dialog: false,
      snackbar: false,
      feedbackMessage: null
    }
  },
  methods: {
    onClickButton () {
      if (this.isInterested) {
        this.dialog = true
      } else {
        this.toggleInterest()
      }
    },
    handleError (feedbackMessage) {
      this.snackbar = true
      this.feedbackMessage = feedbackMessage
    },
    async toggleInterest () {
      const updateInterestResponse = await this.updateInterestRequest()
      if (!updateInterestResponse) {
        this.handleError('Interesse konnte nicht aktualisiert werden')
      }
      this.$emit('update-interest')
      this.dialog = false
    },
    updateInterestRequest () {
      const url = '/api/v2/interest/item/' + this.itemId + '?isInterested=' + !this.isInterested
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve) {
        _this.$axios.patch(url, config)
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
    }
  }
}
</script>
