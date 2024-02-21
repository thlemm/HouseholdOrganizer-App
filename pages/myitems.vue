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
      <info-card-loader
        :lazy="lazy"
        :items="items"
        :loading="loading"
        @loaded-items="loading = false"
        @reloaded-item="replaceReloadedItem($event)"
      />
    </v-container>
  </v-layout>
</template>

<script>
import { mdiHeart } from '@mdi/js'
import InfoSnackbar from '~/components/feedback/info-snackbar'

export default {
  name: 'MyStuff',
  components: { InfoSnackbar },
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
    replaceReloadedItem (item) {
      const index = this.items.findIndex(obj => obj.id === item.id)
      if (index !== -1) {
        this.$set(this.items, index, item)
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
