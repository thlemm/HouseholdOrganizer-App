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
      :icon="mdiMagnify"
      color="primary"
    >
      Suchen
    </v-banner>

    <br>
    <v-form>
      <v-row>
        <v-col align="center">
          <v-text-field
            v-model="input.mark"
            type="number"
            outlined
            dense
            clearable
            label="Teilenummer"
          />

          <v-select
            v-model="input.type"
            :items="types"
            item-text="label"
            item-value="id"
            clearable
            outlined
            dense
            label="Typ"
          />

          <input-tags
            v-model="input.tags"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col align="end">
          <v-btn
            :disabled="loading"
            color="secondary"
            @click="search"
          >
            Suchen
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-divider class="mt-3 mb-0" />
    <span class="mt-0 pt-0 mb-5 grey--text">{{ items.length }} {{ items.length > 1 ? 'Ergebnisse' : 'Ergebnis' }} gefunden:</span>
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
          @reload-data="search"
        />
      </v-lazy>
    </div>
  </v-container>
</template>

<script>
import { mdiMagnify } from '@mdi/js'
import InputTags from '~/components/input/input-tags'
import LoadingAnimation from '~/components/feedback/loading-animation'
import InfoSnackbar from '~/components/feedback/info-snackbar'
export default {
  name: 'Search',
  components: { InfoSnackbar, LoadingAnimation, InputTags },
  layout: 'default',

  data () {
    return {
      mdiMagnify,
      alert: false,
      message: '',
      loading: false,
      types: [
        { id: 1, name: 'TYPE_DECORATION', label: this.$t('TYPE_DECORATION') },
        { id: 2, name: 'TYPE_FURNITURE', label: this.$t('TYPE_FURNITURE') },
        { id: 3, name: 'TYPE_UTILITY_ITEM', label: this.$t('TYPE_UTILITY_ITEM') },
        { id: 4, name: 'ROOM_TECHNICAL_DEVICE', label: this.$t('ROOM_TECHNICAL_DEVICE') },
        { id: 5, name: 'ROOM_FURNISHING', label: this.$t('ROOM_FURNISHING') }
      ],
      input: {
        mark: null,
        type: null,
        tags: []
      },
      items: [],
      snackbar: false,
      feedbackMessage: null,
      eventsCounter: 0,
      eventLimit: 0,
      lazy: true
    }
  },

  beforeMount () {
    if (!this.$auth.loggedIn) {
      this.$nuxt.$router.replace('/login?target=search')
    }
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
    createPayload () {
      if (this.input.mark) {
        return {
          mark: this.input.mark,
          tags: this.input.tags
        }
      } else if (this.input.type === null) {
        return { tags: this.input.tags }
      } else {
        return {
          type: this.input.type,
          tags: this.input.tags
        }
      }
    },
    async search () {
      this.items = []
      this.lazy = false
      this.eventsCounter = 0
      this.loading = true
      const searchResponse = await this.searchRequest()
      if (searchResponse) {
        this.items = searchResponse
        this.eventLimit = this.items.length
        this.lazy = true
      } else {
        this.items = []
        this.handleError('Fehler bei Abfrage der Daten')
      }
    },
    searchRequest () {
      const url = '/api/v2/items/search'
      const payload = this.createPayload()
      const config = { headers: { Authorization: this.$auth.getToken('local') } }
      const _this = this
      return new Promise(function (resolve) {
        _this.$axios.post(url, payload, config)
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
