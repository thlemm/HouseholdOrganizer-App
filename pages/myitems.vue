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
        class="mb-3 pt-0"
        elevation="3"
        :icon="mdiHeart"
        color="primary"
      >
        Meine Sachen {{ items?.length > 0 ? '(' + (items?.length) + ')' : '' }}
      </v-banner>
      <info-card
        v-if="items.length === 0 && loading === false"
        title="Nichts gefunden"
        subtitle="Hier werden die Sachen angezeigt, die mit deinem Account verknüpft sind."
      />
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
            :action-remove-interest="true"
            @reload-data="getData"
          />
        </v-lazy>
      </div>
    </v-container>
  </v-layout>
</template>

<script>
import { mdiHeart } from '@mdi/js'
import InfoSnackbar from '~/components/feedback/info-snackbar'
import LoadingAnimation from '~/components/feedback/loading-animation'

export default {
  name: 'MyStuff',
  components: { LoadingAnimation, InfoSnackbar },
  layout: 'default',

  data () {
    return {
      mdiHeart,
      show: null,
      items: [],
      isActive: false,
      username: undefined,
      snackbar: false,
      feedbackMessage: null,
      loading: false,
      eventsCounter: 0,
      eventLimit: 0,
      lazy: true
    }
  },
  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=myitems')
    }
    this.getData()
  },
  methods: {
    countLoadingEvents () {
      this.eventsCounter += 1
      if (this.eventsCounter === this.eventLimit) {
        this.loading = false
      }
    },
    handleError (feedbackMessage) {
      this.snackbar = true
      this.feedbackMessage = feedbackMessage
      this.loading = false
    },
    async getData () {
      if (this.$auth.loggedIn) {
        this.lazy = false
        this.eventsCounter = 0
        this.loading = true
        const getUserItemsResponse = await this.getUserItemsRequest()
        if (getUserItemsResponse) {
          if (getUserItemsResponse.length === 0) {
            this.loading = false
          }
          this.items = getUserItemsResponse
          this.eventLimit = this.items.length
          this.lazy = true
        } else {
          this.snackbar = true
          this.handleError('Fehler bei Abfrage der Daten')
        }
      } else {
        this.snackbar = true
        this.handleError('Du bist nicht korrekt eingeloggt')
      }
    },
    getUserItemsRequest () {
      const url = '/api/v2/items/user'
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
